'use strict';

const biteship = require('../libs/biteship');

require('dotenv').config();

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

    const FALLBACK = {
      name: 'Merchant',
      phone: '08123456789',
      email: 'merchant@example.com',
      address: 'Jl. Kebon Jeruk, Jakarta',
      zipcode: '12345',
      area_id: 'JKT',
      latitude: 0,
      longitude: 0,
    };

    const MERCHANT = {
      name: process.env.MERCHANT_NAME,
      phone: process.env.MERCHANT_PHONE,
      email: process.env.MERCHANT_EMAIL,
      address: process.env.MERCHANT_ADDRESS,
      zipcode: process.env.MERCHANT_ZIPCODE,
      latitude: parseFloat(process.env.MERCHANT_LATITUDE),
      longitude: parseFloat(process.env.MERCHANT_LONGITUDE),
    };

    const { data } = await biteship.post('/locations', {
      name: MERCHANT.name,
      contact_name: MERCHANT.name,
      contact_phone: MERCHANT.phone,
      address: MERCHANT.address,
      note: MERCHANT.name,
      postal_code: MERCHANT.zipcode,
      latitude: MERCHANT.latitude,
      longitude: MERCHANT.longitude,
      type: 'destination',
    });

    try {
      await queryInterface.bulkInsert(
        'merchants',
        [
          {
            name: MERCHANT.name || FALLBACK.name,
            phone: MERCHANT.phone || FALLBACK.phone,
            email: MERCHANT.email || FALLBACK.email,
            address: MERCHANT.address || FALLBACK.address,
            zipcode: MERCHANT.zipcode || FALLBACK.zipcode,
            area_id: data.id,
            latitude: MERCHANT.latitude || FALLBACK.latitude,
            longitude: MERCHANT.longitude || FALLBACK.longitude,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        {}
      );
    } catch (error) {
      console.log('Error seeding merchant:', error);
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
