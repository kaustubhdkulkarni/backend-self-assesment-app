const { db } = require('../../../db/db');

const getMyTransactions = async ({ user, page, limit, filter, sort }) => {

	const to3 = (n) => {
		const trimmed = Math.trunc(Number(n) * 1000) / 1000;
		return trimmed.toString().includes(".")
			? trimmed.toString().padEnd(trimmed.toString().indexOf(".") + 4, "0")
			: trimmed.toString() + ".000";
	};

	try {
		// Ensure page and limit are integers
		const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
		const limitNumber = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
		const offset = (pageNumber - 1) * limitNumber;

		// Default sorting
		let sortBy = ['createdAt', 'DESC']; // Default sort by creation date
		// Parse sorting if provided
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
		const getResults = await db.Transaction.findAll({
			where: { userId: user.id, ...filterObj },
			order: [sortBy], // Sorting
			limit: limitNumber, // Number of records per page
			offset: offset, 
			raw: false
		});

		if (getResults?.length > 0) {
			// Fetch total count for pagination details
			const totalResults = await db.Transaction.count({ where: { userId: user.id, ...filterObj } });
			const totalPages = Math.ceil(totalResults / limitNumber);


			const formattedData = getResults.map(item => {
				const plainItem = item.toJSON(); // Convert to plain object
				return {
					...plainItem,
					transactionAmount: to3(item.getDataValue('transactionAmount')),
					remainingAmount: to3(item.getDataValue('remainingAmount'))
				};
			});



			return {
				data: {
					transactions: formattedData,
					totalPages,
					totalResults,
					page: pageNumber,
					limit: limitNumber
				},
				status: true,
				code: 200
			};
		} else {
			return {
				status: false, code: 404, msg: "No transactions found."
			}
		}
	} catch (error) {
		console.error("Error while getting transactions  :", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = getMyTransactions;