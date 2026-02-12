const { Op } = require("sequelize");
const { db } = require("../../../db/db");
const UserModel = require("../user.model");

const getAllUsers = async (user, sort, page = 1, limit = 10, filter = {}) => {
  try {
    const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const limitNumber = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const offset = (pageNumber - 1) * limitNumber;

    let sortBy = ["createdAt", "DESC"];
    if (typeof sort === "string") {
      try {
        sortBy = JSON.parse(decodeURIComponent(sort));
      } catch (e) {
        console.error("Invalid sort string:", e);
        sortBy = ["createdAt", "DESC"];
      }
    } else if (Array.isArray(sort) && sort.length > 0) {
      sortBy = sort;
    }

    let filterQuery = {};
    let filterObj = {};
    let includeConditions = [];
    if (typeof filter === "string") {
      try {
        filterObj = JSON.parse(decodeURIComponent(filter));
      } catch (e) {
        console.error("Invalid filter string:", e);
        filterObj = {};
      }
    } else if (Array.isArray(filter) && filter.length > 0) {
      filterObj = Object.assign({}, ...filter.map((f) => JSON.parse(f)));
    }
    if (Object.keys(filterObj)?.length) {
      if (filterObj?.search && filterObj.search !== undefined) {
        filterQuery = {
          [Op.or]: [
            { firstName: { [Op.like]: `%${filterObj.search}%` } },
            { lastName: { [Op.like]: `%${filterObj.search}%` } },
            { middleName: { [Op.like]: `%${filterObj.search}%` } },
            { email: { [Op.like]: `%${filterObj.search}%` } },
            { phone: { [Op.like]: `%${filterObj.search}%` } },
          ],
        };
      }
      if (filterObj?.accountType && filterObj.accountType !== undefined) {
        filterQuery.accountType = filterObj.accountType;
      }
      if (filterObj?.roleType && filterObj.roleType !== undefined) {
        filterQuery.role = filterObj.roleType;
      }
    }

    if (filterObj?.investorRole && filterObj?.investorRole !== undefined) {
      includeConditions.push({
        model: db.SubRoles,
        as: "subRoleObj",
        attributes: ["id", "subRoleName"],
        required: true,
        where: {
          subRoleName: {
            [Op.like]: `%${filterObj.investorRole}%`,
          },
        },
      });
    } else {
      includeConditions.push({
        model: db.SubRoles,
        as: "subRoleObj",
        attributes: ["id", "subRoleName"],
        required: false,
      });
    }
    const whereCondition = {
      active: true,
      ...filterQuery,
    };

    includeConditions.push({
      model: db.SystemUserRoles,
      as: "systemUserRoleObj",
      attributes: ["id", "systemUserRoleName", "modulePermissions"],
    });

    const userList = await db.Users.findAll({
      where: whereCondition,
      order: [sortBy],
      limit: limitNumber,
      offset: offset,
      include: includeConditions,
    });

    const totalResults = await db.Users.count({
      where: whereCondition,
      include: includeConditions,
    });
    const totalPages = Math.ceil(totalResults / limitNumber);

    return {
      data: {
        users: userList,
        totalPages,
        totalResults,
        page: pageNumber,
        limit: limitNumber,
      },
      status: true,
      code: 200,
    };
  } catch (error) {
    console.error("Error while getting users:", error);
    return { msg: error.message, status: false, code: 500 };
  }
};

module.exports = getAllUsers;
