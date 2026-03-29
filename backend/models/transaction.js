'use strict';
const { Model } = require('sequelize');
const { scope } = require('../middleware/authorize');

module.exports = (sequelize, DataTypes) => {
	class Transaction extends Model {
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

			this.hasMany(models.TransactionItem, {
				foreignKey: 'transaction_id',
				as: 'transaction_items',
			});
		}
	}
	Transaction.init(
		{
			uuid: {
				allowNull: false,
				type: DataTypes.STRING,
				defaultValue: DataTypes.UUIDV4,
				validate: {
					notEmpty: true,
				},
			},
			name: {
				allowNull: false,
				type: DataTypes.STRING,
				validate: {
					notEmpty: true,
				},
			},
			phone: {
				allowNull: false,
				type: DataTypes.STRING,
				validate: {
					notEmpty: true,
				},
			},
			address: {
				allowNull: false,
				type: DataTypes.STRING,
				validate: {
					notEmpty: true,
				},
			},
			note: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			latitude: {
				allowNull: false,
				type: DataTypes.FLOAT,
				validate: {
					notEmpty: true,
				},
			},
			longitude: {
				allowNull: false,
				type: DataTypes.FLOAT,
				validate: {
					notEmpty: true,
				},
			},
			borrowed_date: {
				allowNull: false,
				type: DataTypes.DATEONLY,
				validate: {
					notEmpty: true,
				},
			},
			deadline_date: {
				allowNull: false,
				type: DataTypes.DATEONLY,
				validate: {
					notEmpty: true,
				},
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
				validate: {
					notEmpty: true,
				},
			},
			user_id: {
				allowNull: false,
				type: DataTypes.INTEGER,
				validate: {
					notEmpty: true,
				},
			},
		},
		{
			sequelize,
			modelName: 'Transaction',
			tableName: 'transactions',
			underscored: true,
			scopes: scope,
			hooks: {
				afterUpdate: async (transaction) => {
					const status = transaction.status;
					const items = await sequelize.models.TransactionItem.findAll({
						where: {
							transaction_id: transaction.id,
						},
						include: ['book'],
					});

					const TO_BE_RETURNED = ['completed', 'rejected'];
					if (!TO_BE_RETURNED.includes(status)) return;

					items.forEach(async ({ book, amount }) => {
						await book.update({
							amount: book.amount + amount,
						});
						await book.save();
					});
				},
				beforeDestroy: async (transaction) => {
					const RETURNED = ['completed', 'rejected'];
					if (RETURNED.includes(transaction.status)) return;

					const items = await sequelize.models.TransactionItem.findAll({
						where: {
							transaction_id: transaction.id,
						},
						include: ['book'],
					});

					items.forEach(async ({ book, amount }) => {
						await book.update({
							amount: book.amount + amount,
						});
						await book.save();
					});
				},
			},
		}
	);

	return Transaction;
};
