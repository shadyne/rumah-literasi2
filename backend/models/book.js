'use strict';
const path = require('path');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Book extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasMany(models.TransactionItem, {
				foreignKey: 'transaction_id',
				as: 'transaction_items',
			});
		}
	}
	Book.init(
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			author: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			publisher: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			year: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			language: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			amount: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			cover: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
				get() {
					const value = this.getDataValue('cover');
					const check = value.startsWith('http');
					return check ? value : process.env.APP_URL + '/' + value;
				},
			},
		},
		{
			sequelize,
			modelName: 'Book',
			tableName: 'books',
			underscored: true,
		}
	);
	return Book;
};
