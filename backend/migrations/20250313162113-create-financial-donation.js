'use strict';
const { PAYMENT_STATUS } = require('../libs/constant');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('financial_donations', {
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
				values: [
					PAYMENT_STATUS.PENDING,
					PAYMENT_STATUS.SUCCESS,
					PAYMENT_STATUS.FAILED,
				],
				defaultValue: PAYMENT_STATUS.PENDING,
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
				references: {
					model: 'users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			acceptance_notes: {
				allowNull: true,
				type: DataTypes.STRING,
				defaultValue: '',
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
		await queryInterface.dropTable('financial_donations');
	},
};
