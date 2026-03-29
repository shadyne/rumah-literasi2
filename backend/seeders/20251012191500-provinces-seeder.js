'use strict';

const { capitalize } = require('../libs/util');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		const provinces = require('../data/provinces.json');

		try {
			const provincesData = provinces.map((province) => ({
				...province,
				name: capitalize(province.name),
				created_at: new Date(),
				updated_at: new Date(),
			}));

			await queryInterface.bulkInsert('provinces', provincesData, {});
		} catch (error) {
			console.log('Error inserting provinces:', error);
		}
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete('provinces', null, {});
	},
};
