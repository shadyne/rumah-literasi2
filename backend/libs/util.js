/**
 * Convert a string to title case
 * @param {string} str - The string to convert
 * @returns {string} - The string in title case
 */
const capitalize = (str) => {
	if (!str || typeof str !== 'string') return str;

	return str
		.toLowerCase()
		.split(' ')
		.map((word) => {
			if (word.length > 0)
				return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
			return word;
		})
		.join(' ');
};

module.exports = {
	capitalize,
};
