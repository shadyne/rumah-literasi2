const base = require('axios');

const biteship = base.create({
	baseURL: process.env.BITESHIP_API_URL,
	headers: {
		'Content-Type': 'application/json',
		authorization: process.env.BITESHIP_API_KEY,
	},
});

module.exports = biteship;
