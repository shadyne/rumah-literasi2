const fs = require('fs');
const path = require('path');

const EmailHelper = {
	/**
	 * Renders an email template with the given variables
	 * @param {string} filename - The name of the template
	 * @param {object} variables - The variables to replace in the template
	 * @returns {string} - The rendered email template
	 */
	render: (filename, variables) => {
		const filepath = path.join(__dirname, '../out', `${filename}.html`);
		let html = fs.readFileSync(filepath, 'utf8');

		Object.keys(variables).forEach((key) => {
			const placeholder = new RegExp(`{{${key}}}`, 'g');
			html = html.replace(placeholder, variables[key]);
		});

		return html;
	},
};

module.exports = EmailHelper;
