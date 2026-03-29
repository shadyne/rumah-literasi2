const delay = (duration) => async (req, res, next) => {
	const random = Math.floor(Math.random() * duration);
	await new Promise((resolve) => setTimeout(resolve, random));
	next();
};

module.exports = {
	delay,
};
