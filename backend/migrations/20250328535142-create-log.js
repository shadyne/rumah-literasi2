const { DataTypes } = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('logs', {
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
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'users',
					key: 'id',
				},
				onDelete: 'SET NULL',
				onUpdate: 'CASCADE',
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

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('logs');
	},
};
