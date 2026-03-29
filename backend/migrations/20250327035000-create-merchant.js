'use strict';

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('merchants', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			address: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			zipcode: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			area_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			latitude: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			longitude: {
				type: DataTypes.FLOAT,
				allowNull: false,
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

	async down(queryInterface, DataTypes) {
		await queryInterface.dropTable('merchants');
	},
};
