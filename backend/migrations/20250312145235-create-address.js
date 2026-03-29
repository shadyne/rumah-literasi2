/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('addresses', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			area_id: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			name: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			contact_name: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			contact_phone: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			street_address: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			latitude: {
				allowNull: false,
				type: DataTypes.FLOAT,
			},
			longitude: {
				allowNull: false,
				type: DataTypes.FLOAT,
			},
			province_id: {
				allowNull: false,
				type: DataTypes.STRING,
				references: {
					model: 'provinces',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			city_id: {
				allowNull: false,
				type: DataTypes.STRING,
				references: {
					model: 'cities',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			district_id: {
				allowNull: false,
				type: DataTypes.STRING,
				references: {
					model: 'districts',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			zipcode: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			note: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			is_default: {
				allowNull: false,
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			user_id: {
				allowNull: false,
				type: DataTypes.INTEGER,
				references: {
					model: 'users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
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
		await queryInterface.dropTable('addresses');
	},
};
