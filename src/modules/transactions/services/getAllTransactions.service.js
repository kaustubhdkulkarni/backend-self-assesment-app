const { db, Op } = require('../../../db/db');

const getAllTransactions = async (sort, page = 1, limit = 10, filter = {}) => {
    try {
        const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const limitNumber = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const offset = (pageNumber - 1) * limitNumber;

        let sortBy = ['createdAt', 'DESC']; 
        if (typeof sort === 'string') {
            try {
                sortBy = JSON.parse(decodeURIComponent(sort));
            } catch (e) {
                console.error('Invalid sort string:', e);
                sortBy = ['createdAt', 'DESC'];
            }
        } else if (Array.isArray(sort) && sort.length > 0) {
            sortBy = sort;
        }

        let filterQuery = {}
        let filterObj = {}
        if (typeof filter === 'string') {
            try {
                filterObj = JSON.parse(decodeURIComponent(filter));
            } catch (e) {
                console.error('Invalid filter string:', e);
                filterObj = {};
            }
        } else if (Array.isArray(filter) && filter.length > 0) {
            filterObj = filter;
        }

        if (Object.keys(filterObj)?.length) {
            if (filterObj?.transactionType && filterObj.transactionType !== undefined) {
                filterQuery.transactionType = filterObj.transactionType; 
            }
            if (filterObj?.transactionStatus && filterObj.transactionStatus !== undefined) {
                filterQuery.transactionStatus = filterObj.transactionStatus;
            }
        }
        
        const transactionsList = await db.Transaction.findAll({ 
            where: filterQuery,
            order: [sortBy], 
            limit: limitNumber, 
            offset: offset,
            include: [
                {
                    model: db.Users, 
                    as: 'userObj',
                    
                    required: true, 
                },
            ],
        });

        if (!transactionsList || transactionsList?.length === 0) {
			return {
				msg: "No Transactions found.",
				status: false,
				code: 404
			}
		}



        const totalResults = await db.Transaction.count({ where: filterQuery });
        const totalPages = Math.ceil(totalResults / limitNumber);

        return {
            data: {
                transactions: transactionsList,
                totalPages,
                totalResults,
                page: pageNumber,
                limit: limitNumber
            },
            status: true,
            code: 200
        };
    } catch (error) {
        console.error("Error while getting transactions:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = getAllTransactions;
