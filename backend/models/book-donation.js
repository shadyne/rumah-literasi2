'use strict';
const { Model } = require('sequelize');
const { scope } = require('../middleware/authorize');
const { PAYMENT_STATUS } = require('../libs/constant');

module.exports = (sequelize, DataTypes) => {
	class BookDonation extends Model {
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
			this.belongsTo(models.Address, {
				foreignKey: 'address_id',
				as: 'address',
			});
			this.hasMany(models.BookDonationItem, {
				foreignKey: 'book_donation_id',
				as: 'book_donation_items',
			});
		}
	}
	BookDonation.init(
		{
			uuid: {
				allowNull: false,
				type: DataTypes.STRING,
				defaultValue: DataTypes.UUIDV4,
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
			address_id: {
				allowNull: false,
				type: DataTypes.INTEGER,
				validate: {
					notEmpty: true,
				},
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
		},
		{
			sequelize,
			modelName: 'BookDonation',
			tableName: 'book_donations',
			underscored: true,
			scopes: scope,
		}
	);
	return BookDonation;
};
