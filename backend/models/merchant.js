'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Merchant extends Model {
		static associate(models) {
			//
		}
	}
	Merchant.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					isEmail: true,
				},
			},
			address: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			zipcode: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			area_id: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			latitude: {
				type: DataTypes.FLOAT,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			longitude: {
				type: DataTypes.FLOAT,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
		},
		{
			sequelize,
			modelName: 'Merchant',
			tableName: 'merchants',
			underscored: true,
			timestamps: true,
		}
	);
	return Merchant;
};
