'use strict';

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('districts', {
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
			created_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
			updated_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('districts');
	},
};
