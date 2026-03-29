'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class City extends Model {
		static associate(models) {
			this.belongsTo(models.Province, {
				foreignKey: 'province_id',
				as: 'province',
			});
			this.hasMany(models.District, {
				foreignKey: 'city_id',
				as: 'districts',
			});
			this.hasMany(models.Address, {
				foreignKey: 'city_id',
				as: 'addresses',
			});
		}
	}
	City.init(
		{
			id: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			province_id: {
				type: DataTypes.STRING,
				allowNull: false,
				references: {
					model: 'provinces',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			latitude: {
				type: DataTypes.DOUBLE,
				allowNull: true,
				defaultValue: 0,
			},
			longitude: {
				type: DataTypes.DOUBLE,
				allowNull: true,
				defaultValue: 0,
			},
		},
		{
			sequelize,
			modelName: 'City',
			tableName: 'cities',
			underscored: true,
			timestamps: true,
		}
	);
	return City;
};
