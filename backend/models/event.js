'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Event extends Model {
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
	Event.init(
		{
			title: {
				allowNull: false,
				type: DataTypes.STRING,
				validate: {
					notEmpty: true,
				},
			},
			description: {
				allowNull: false,
				type: DataTypes.TEXT,
				validate: {
					notEmpty: true,
				},
			},
			date: {
				allowNull: false,
				type: DataTypes.DATEONLY,
				validate: {
					notEmpty: true,
				},
			},
			time: {
				allowNull: false,
				type: DataTypes.TIME,
			},
			location: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			media: {
				allowNull: false,
				type: DataTypes.STRING,
				get() {
					const value = this.getDataValue('media');
					const check = value.startsWith('http');
					return check ? value : process.env.APP_URL + '/' + value;
				},
			},
			user_id: {
				allowNull: false,
				type: DataTypes.INTEGER,
				validate: {
					isNumeric: true,
				},
			},
		},
		{
			sequelize,
			modelName: 'Event',
			tableName: 'events',
			underscored: true,
		}
	);
	return Event;
};
