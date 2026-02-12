const { db } = require("../../../db/db");

const getAllSystemUserRoles = async ({sort, page, limit, filter}) => {
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

        let filterObj = {};
        if (typeof filter === "string") {
            try {
                filterObj = JSON.parse(decodeURIComponent(filter));
            } catch (e) {
                console.error("Invalid filter string:", e);
                filterObj = {};
            }
        } else if (Array.isArray(filter) && filter.length > 0) {
            filterObj = filter;
        }

        const systemUserRole = await db.SystemUserRoles.findAll({
            where: filterObj,  
            order: [sortBy],    
            limit: limitNumber, 
            offset: offset,     
        });

        const totalResults = await db.SystemUserRoles.count({
            where: filterObj,    
        });
        const totalPages = Math.ceil(totalResults / limitNumber);

        if (systemUserRole.length === 0) {
            return {
                status: false,
                code: 404,
                msg: `System user role records not found.`,
            };
        }

        return {
            status: true,
            code: 200,
            data: {
                systemUserRole: systemUserRole,
                totalPages,
                totalResults,
                page: pageNumber,
                limit: limitNumber,
            },
        };
    } catch (error) {
        console.error("Error while fetching system user roles:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = getAllSystemUserRoles;
