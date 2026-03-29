'use strict';
const { PAYMENT_STATUS } = require('../libs/constant');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('book_donations', {
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
			address_id: {
				allowNull: false,
				type: DataTypes.INTEGER,
				references: {
					model: 'addresses',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			estimated_value: {
				allowNull: false,
				type: DataTypes.INTEGER,
				validate: {
					notEmpty: true,
				},
			},
			length: {
				allowNull: true,
				type: DataTypes.FLOAT,
			},
			width: {
				allowNull: true,
				type: DataTypes.FLOAT,
			},
			height: {
				allowNull: true,
				type: DataTypes.FLOAT,
			},
			weight: {
				allowNull: true,
				type: DataTypes.FLOAT,
			},
			media: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			acceptance_notes: {
				allowNull: true,
				type: DataTypes.STRING,
				defaultValue: '',
			},
			order_id: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			tracking_id: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			shipping_fee: {
				allowNull: true,
				type: DataTypes.FLOAT,
			},
			shipping_eta: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			courier_code: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			courier_service_code: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			created_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
			updated_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('book_donations');
	},
};
