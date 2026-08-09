'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('book_donations', 'delivery_status', {
			allowNull: true,
			type: Sequelize.STRING,
		});
		await queryInterface.addColumn(
			'book_donations',
			'delivery_status_updated_at',
			{
				allowNull: true,
				type: Sequelize.DATE,
			}
		);
	},

	async down(queryInterface) {
		await queryInterface.removeColumn(
			'book_donations',
			'delivery_status_updated_at'
		);
		await queryInterface.removeColumn('book_donations', 'delivery_status');
	},
};
