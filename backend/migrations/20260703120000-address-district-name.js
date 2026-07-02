'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Kecamatan kini diketik bebas oleh user (data kecamatan di DB tidak lengkap).
		await queryInterface.addColumn('addresses', 'district_name', {
			allowNull: true,
			type: Sequelize.STRING,
		});

		// district_id tidak lagi wajib (alamat baru pakai district_name).
		await queryInterface.changeColumn('addresses', 'district_id', {
			allowNull: true,
			type: Sequelize.STRING,
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('addresses', 'district_name');
		await queryInterface.changeColumn('addresses', 'district_id', {
			allowNull: false,
			type: Sequelize.STRING,
		});
	},
};
