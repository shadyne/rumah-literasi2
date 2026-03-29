'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('donations', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			uuid: {
				allowNull: false,
				type: DataTypes.STRING,
				defaultValue: DataTypes.UUIDV4,
			},
			amount: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			status: {
				allowNull: false,
				type: DataTypes.ENUM,
				values: ['pending', 'success', 'failed'],
				defaultValue: 'pending',
			},
			notes: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			payment_url: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			user_id: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			created_at: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			updated_at: {
				allowNull: false,
				type: DataTypes.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('donations');
	},
};
