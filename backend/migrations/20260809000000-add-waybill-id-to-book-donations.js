'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('book_donations', 'waybill_id', {
			allowNull: true,
			type: Sequelize.STRING,
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn('book_donations', 'waybill_id');
	},
};
