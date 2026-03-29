class ApiError extends Error {
	constructor(status, message = 'Something went wrong', errors = {}) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.message = message;
		this.errors = errors;
	}
}

module.exports = ApiError;
