'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        first_name: 'John',
        last_name: 'Wick',
        phone_number: '123-456-7890',
        address: 'Sidoarjo',
        pin: '12345',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Eren',
        last_name: 'Uchiha',
        phone_number: '987-654-3210',
        address: 'Jaksel',
        pin: '12345',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
