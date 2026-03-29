'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('transactions', {
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
			name: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			phone: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			address: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			note: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			latitude: {
				allowNull: false,
				type: DataTypes.FLOAT,
			},
			longitude: {
				allowNull: false,
				type: DataTypes.FLOAT,
			},
			borrowed_date: {
				allowNull: false,
				type: DataTypes.DATEONLY,
			},
			deadline_date: {
				allowNull: false,
				type: DataTypes.DATEONLY,
			},
			returned_date: {
				allowNull: true,
				type: DataTypes.DATEONLY,
			},
			zipcode: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			tracking_id: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			courier_company: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			courier_type: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			devlivery_eta: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			delivery_fee: {
				allowNull: true,
				type: DataTypes.FLOAT,
			},
			status: {
				allowNull: false,
				type: DataTypes.ENUM,
				values: ['pending', 'approved', 'rejected', 'completed'],
				defaultValue: 'pending',
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
		await queryInterface.dropTable('transactions');
	},
};
