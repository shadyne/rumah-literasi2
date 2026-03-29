const fs = require('fs');
const path = require('path');
const transporter = require('../libs/nodemailer');
const EmailHelper = require('../libs/email-template');

const NODEMAILER_FROM = process.env.NODEMAILER_FROM;
const ACTIVATE_EMAIL = process.env.ACTIVATE_EMAIL == 'true';

const EmailController = {
	/**
	 * Sends a verification email to the user
	 * @param {string} otp - The OTP code
	 * @param {object} user - The user object
	 */
	otp: async (otp, user) => {
		const html = EmailHelper.render('otp-notification', {
			otp,
			name: user.name,
		});

		if (ACTIVATE_EMAIL) {
			await transporter.sendMail({
				from: NODEMAILER_FROM,
				to: user.email,
				subject: 'Your verification code for secure access',
				html: html,
			});
			return;
		}

		console.log(otp);
	},

	/**
	 * Sends a verification email to the user
	 * @param {string} href - The verification link
	 * @param {object} user - The user object
	 */
	verify: async (href, user) => {
		const html = EmailHelper.render('user-verification', {
			href,
			name: user.name,
		});

		if (ACTIVATE_EMAIL) {
			await transporter.sendMail({
				from: NODEMAILER_FROM,
				to: user.email,
				subject: 'One more step to complete your registration',
				html: html,
			});
			return;
		}

		console.log(href);
	},

	/**
	 * Sends a password reset email to the user
	 * @param {string} href - The password reset link
	 * @param {object} user - The user object
	 */
	forgotPassword: async (href, user) => {
		const html = EmailHelper.render('forgot-password', {
			href,
			name: user.name,
		});

		if (ACTIVATE_EMAIL) {
			await transporter.sendMail({
				from: NODEMAILER_FROM,
				to: user.email,
				subject: 'Password reset link',
				html: html,
			});
			return;
		}

		console.log(href);
	},
};

module.exports = EmailController;
