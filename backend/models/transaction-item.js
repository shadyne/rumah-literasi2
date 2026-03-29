'use strict';
const { Model } = require('sequelize');
const ApiError = require('../libs/error');

module.exports = (sequelize, DataTypes) => {
	class TransactionItem extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.Transaction, {
				foreignKey: 'transaction_id',
				as: 'transaction',
			});

			this.belongsTo(models.Book, {
				foreignKey: 'book_id',
				as: 'book',
			});
		}
	}
	TransactionItem.init(
		{
			book_id: {
				allowNull: false,
				type: DataTypes.INTEGER,
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
			transaction_id: {
				allowNull: false,
				type: DataTypes.INTEGER,
				validate: {
					notEmpty: true,
				},
			},
		},
		{
			sequelize,
			modelName: 'TransactionItem',
			tableName: 'transaction_items',
			underscored: true,
			hooks: {
				afterValidate: async (item) => {
					const book = await sequelize.models.Book.findOne({
						where: { id: item.book_id },
					});

					if (!book) throw new ApiError(400, 'Book not found');
					if (book.amount < item.amount) {
						throw new ApiError(400, 'Book' + book.title + ' is out of stock');
					}
				},
				afterCreate: async (item) => {
					const book = await sequelize.models.Book.findOne({
						where: { id: item.book_id },
					});

					await book.update({
						amount: book.amount - item.amount,
					});

					await book.save();
				},
				beforeDestroy: async (item) => {
					const transaction = await sequelize.models.Transaction.findOne({
						where: { id: item.transaction_id },
					});

					const RETURNED = ['completed', 'rejected'];
					if (RETURNED.includes(transaction.status)) return;

					const book = await sequelize.models.Book.findOne({
						where: { id: item.book_id },
					});

					await book.update({
						amount: book.amount + item.amount,
					});

					await book.save();
				},
			},
		}
	);

	return TransactionItem;
};
