'use strict';

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
			await queryInterface.bulkInsert(
				'books',
				[
					{
						title: '1984',
						author: 'George Orwell',
						publisher: 'Secker & Warburg',
						year: 1949,
						language: 'English',
						amount: 15,
						cover: 'uploads\\1984.jpg',
						created_at: new Date(),
						updated_at: new Date(),
					},
					{
						title: 'The Lord of the Rings',
						author: 'J.R.R. Tolkien',
						publisher: 'Allen & Unwin',
						year: 1954,
						language: 'English',
						amount: 12,
						cover: 'uploads\\the-lord-of-the-rings.jpg',
						created_at: new Date(),
						updated_at: new Date(),
					},
					{
						title: 'Pride and Prejudice',
						author: 'Jane Austen',
						publisher: 'T. Egerton',
						year: 1813,
						language: 'English',
						amount: 20,
						cover: 'uploads\\pride-and-prejudice.jpg',
						created_at: new Date(),
						updated_at: new Date(),
					},
					{
						title: 'Animal Farm',
						author: 'George Orwell',
						publisher: 'Secker & Warburg',
						year: 1945,
						language: 'English',
						amount: 18,
						cover: 'uploads\\animal-farm.jpg',
						created_at: new Date(),
						updated_at: new Date(),
					},
					{
						title: 'To Kill a Mockingbird',
						author: 'Harper Lee',
						publisher: 'J.B. Lippincott & Co.',
						year: 1960,
						language: 'English',
						amount: 14,
						cover: 'uploads\\to-kill-a-mockingbird.jpg',
						created_at: new Date(),
						updated_at: new Date(),
					},
					{
						title: 'The Hitchhiker’s Guide to the Galaxy',
						author: 'Douglas Adams',
						publisher: 'Pan Books',
						year: 1979,
						language: 'English',
						amount: 10,
						cover: 'uploads\\the-hitchhikers-guide-to-the-galaxy.jpg',
						created_at: new Date(),
						updated_at: new Date(),
					},
					{
						title: 'The Great Gatsby',
						author: 'F. Scott Fitzgerald',
						publisher: 'Charles Scribner’s Sons',
						year: 1925,
						language: 'English',
						amount: 17,
						cover: 'uploads\\the-great-gatsby.jpg',
						created_at: new Date(),
						updated_at: new Date(),
					},
					{
						title: 'Brave New World',
						author: 'Aldous Huxley',
						publisher: 'Chatto & Windus',
						year: 1932,
						language: 'English',
						amount: 16,
						cover: 'uploads\\brave-new-world.jpg',
						created_at: new Date(),
						updated_at: new Date(),
					},
				],
				{}
			);
		} catch (error) {
			console.log(error);
		}
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
