'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Log extends Model {
		static associate(models) {
			this.belongsTo(models.User, {
				foreignKey: 'user_id',
				as: 'user',
			});
		}
	}
	Log.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				unique: true,
			},
			action: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			user_id: {
				allowNull: false,
				type: DataTypes.INTEGER,
				validate: {
					notEmpty: true,
				},
			},
			resource_type: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			resource_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			message: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			metadata: {
				type: DataTypes.JSON,
				allowNull: true,
			},
			ip_address: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			user_agent: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: 'Log',
			tableName: 'logs',
			underscored: true,
		}
	);
	return Log;
};
