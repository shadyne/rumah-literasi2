const base = require('axios');

const buffer = Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':');
const midtrans = base.create({
	baseURL: process.env.MIDTRANS_API_URL,
	headers: {
		'Content-Type': 'application/json',
		Authorization: 'Basic ' + buffer.toString('base64'),
	},
});

module.exports = midtrans;
