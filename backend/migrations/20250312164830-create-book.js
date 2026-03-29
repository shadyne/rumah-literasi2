'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('books', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			title: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			author: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			publisher: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			year: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			language: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			amount: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			cover: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			created_at: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			updated_at: {
				allowNull: false,
				type: DataTypes.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('books');
	},
};
