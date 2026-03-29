'use strict';
const { Model } = require('sequelize');
const { scope } = require('../middleware/authorize');
const { PAYMENT_STATUS } = require('../libs/constant');

module.exports = (sequelize, DataTypes) => {
	class FinancialDonation extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.User, {
				foreignKey: 'user_id',
				as: 'user',
			});
		}
	}
	FinancialDonation.init(
		{
			uuid: {
				allowNull: false,
				type: DataTypes.STRING,
				defaultValue: DataTypes.UUIDV4,
				validate: {
					notEmpty: true,
				},
			},
			amount: {
				allowNull: false,
				type: DataTypes.INTEGER,
				validate: {
					notEmpty: true,
				},
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
				validate: {
					notEmpty: true,
				},
			},
			notes: {
				allowNull: true,
				type: DataTypes.STRING,
				validate: {
					notEmpty: true,
				},
			},
			payment_url: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			user_id: {
				allowNull: false,
				type: DataTypes.INTEGER,
				validate: {
					notEmpty: true,
				},
			},
			acceptance_notes: {
				allowNull: true,
				type: DataTypes.STRING,
				defaultValue: '',
			},
		},
		{
			sequelize,
			modelName: 'FinancialDonation',
			tableName: 'financial_donations',
			underscored: true,
			scopes: scope,
		}
	);
	return FinancialDonation;
};
