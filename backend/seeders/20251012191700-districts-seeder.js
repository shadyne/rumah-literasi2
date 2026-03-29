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
		const districts = require('../data/districts.json');

		try {
			const districtsData = districts.map((district) => ({
				...district,
				name: capitalize(district.name),
				created_at: new Date(),
				updated_at: new Date(),
			}));

			await queryInterface.bulkInsert('districts', districtsData, {});
		} catch (error) {
			console.log('Error inserting districts:', error);
		}
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete('districts', null, {});
	},
};
