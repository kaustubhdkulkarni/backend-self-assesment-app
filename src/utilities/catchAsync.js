const catchAsync = (fn) => (req, res, next) => {
	Promise.resolve()
		.then(() => fn(req, res, next))
		.catch(next);
};

module.exports = catchAsync;  