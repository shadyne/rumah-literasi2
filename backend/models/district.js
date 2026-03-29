'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class District extends Model {
		static associate(models) {
			this.belongsTo(models.City, {
				foreignKey: 'city_id',
				as: 'city',
			});
			this.hasMany(models.Address, {
				foreignKey: 'district_id',
				as: 'addresses',
			});
		}
	}
	District.init(
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
			city_id: {
				type: DataTypes.STRING,
				allowNull: false,
				references: {
					model: 'cities',
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
			modelName: 'District',
			tableName: 'districts',
			underscored: true,
			timestamps: true,
		}
	);
	return District;
};
