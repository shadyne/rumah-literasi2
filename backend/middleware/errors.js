const { AxiosError } = require('axios');
const ApiError = require('../libs/error');

const errorHandler = (err, req, res, next) => {
	if (err instanceof AxiosError) {
		console.log(err);
		err = new ApiError(
			err.response.status || 500,
			err.response.data.message || err.response.data.error || err.message,
			err.response.data
		);
	}

	res.locals.message = err.message;
	res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

	console.error({
		path: req.path,
		method: req.method,
		message: err.message,
		user: req.user ? req.user.name : 'Unauthenticated',
		role: req.user ? req.user.role : 'Unauthenticated',
	});

	switch (err.name) {
		case 'SequelizeValidationError':
			res.status(400);
			break;

		case 'ApiError':
			res.status(err.status);
			break;

		default:
			res.status(500);
	}

	res.json({
		message: err.message,
	});
};

module.exports = errorHandler;
