'use strict';

const { where } = require('sequelize');
const { User } = require('../models');
const { ROLES } = require('../libs/constant');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */

		try {
			const user = await User.findOne({
				where: { role: ROLES.ADMIN },
			});

			if (!user) {
				throw new Error(
					'No users found. Please seed users first before seeding events.'
				);
			}

			await queryInterface.bulkInsert(
				'events',
				[
					{
						title: 'Annual Book Donation Campaign',
						description:
							'Join us for our annual book donation campaign where we collect books for underprivileged children in rural areas.',
						date: '2025-06-15',
						time: '09:00:00',
						location: 'Jakarta Convention Center',
						media: 'uploads/event-annual-donation.jpg',
						user_id: user.id,
						created_at: new Date(),
						updated_at: new Date(),
					},
					{
						title: 'Book Fair & Cultural Exchange',
						description:
							'An international book fair featuring authors and publishers from various countries.',
						date: '2025-09-10',
						time: '10:00:00',
						location: 'Jakarta International Expo',
						media: 'uploads/event-book-fair.jpg',
						user_id: user.id,
						created_at: new Date(),
						updated_at: new Date(),
					},
					{
						title: 'Poetry & Literature Night',
						description:
							'An evening of poetry reading, literary discussions, and book recommendations.',
						date: '2025-10-12',
						time: '19:00:00',
						location: 'Literary Café & Bookstore',
						media: 'uploads/event-poetry-night.jpg',
						user_id: user.id,
						created_at: new Date(),
						updated_at: new Date(),
					},
				],
				{}
			);
		} catch (error) {
			console.log('Error seeding events:', error);
			throw error;
		}
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete('events', null, {});
	},
};
