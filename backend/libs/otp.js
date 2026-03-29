const crypto = require('crypto');

const OneTimePassword = {
	/**
	 * Generates a secure one-time password
	 * @param {number} length - The length of the OTP (minimum 6)
	 * @returns {string} - The generated OTP
	 */
	generate(length = 6) {
		const otpLength = Math.max(6, length);
		let otp = '';

		for (let i = 0; i < otpLength; i++) {
			const digit = crypto.randomInt(0, 10);
			otp += digit.toString();
		}

		return otp;
	},

	/**
	 * Verifies if the provided OTP matches the expected OTP
	 * @param {string} provided - The OTP provided by the user
	 * @param {string} expected - The expected OTP
	 * @returns {boolean} - Whether the OTPs match
	 */
	verify(provided, expected) {
		return provided == expected;
	},
};

module.exports = OneTimePassword;
