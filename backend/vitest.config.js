const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
	test: {
		globals: true,
		setupFiles: ['./tests/setup.js'],
		fileParallelism: false,
		testTimeout: 15000,
	},
});
