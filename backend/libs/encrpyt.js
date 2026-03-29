const crypto = require('crypto');

const APP_SECRET = process.env.APP_SECRET;

const Encoder = {
	/**
	 * Encrypts a UUID
	 * @param {string} uuid - The UUID to encrypt
	 * @returns {string} The encrypted UUID
	 */
	encode: (uuid) => {
		const buffer = Buffer.from(uuid, 'utf8');
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv(
			'aes-256-cbc',
			crypto.createHash('sha256').update(APP_SECRET).digest().slice(0, 32),
			iv
		);

		const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
		const result = Buffer.concat([iv, encrypted]);

		return result
			.toString('base64')
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');
	},

	/**
	 * Decrypts a UUID
	 * @param {string} encoded - The encrypted UUID
	 * @returns {string} The decrypted UUID
	 */
	decode: (encoded) => {
		let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
		while (base64.length % 4) {
			base64 += '=';
		}

		const buffer = Buffer.from(base64, 'base64');
		const iv = buffer.slice(0, 16);
		const encrypted = buffer.slice(16);

		const decipher = crypto.createDecipheriv(
			'aes-256-cbc',
			crypto.createHash('sha256').update(APP_SECRET).digest().slice(0, 32),
			iv
		);

		const decrypted = Buffer.concat([
			decipher.update(encrypted),
			decipher.final(),
		]);

		return decrypted.toString('utf8');
	},
};

module.exports = Encoder;
