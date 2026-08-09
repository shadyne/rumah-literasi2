// const base = require('axios');

// const biteship = base.create({
// 	baseURL: process.env.BITESHIP_API_URL,

// 	timeout: Number(process.env.BITESHIP_TIMEOUT_MS) || 20000,
// 	headers: {
// 		'Content-Type': 'application/json',
// 		authorization: process.env.BITESHIP_API_KEY,
// 	},
// });

// module.exports = biteship;

const base = require('axios');

const normalizeBaseURL = (value) => {
	const raw = String(value || 'https://api.biteship.com').trim();
	const withoutTrailingSlash = raw.replace(/\/+$/, '');

	if (/\/v1$/i.test(withoutTrailingSlash)) {
		return `${withoutTrailingSlash}/`;
	}

	return `${withoutTrailingSlash}/v1/`;
};

const biteship = base.create({
	baseURL: normalizeBaseURL(process.env.BITESHIP_API_URL),

	timeout: Number(process.env.BITESHIP_TIMEOUT_MS) || 20000,
	headers: {
		'Content-Type': 'application/json',
		authorization: process.env.BITESHIP_API_KEY,
	},
});

biteship.normalizeBaseURL = normalizeBaseURL;

module.exports = biteship;
