'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Transfers', [
      {
        sender_id: 1,
        target_user: 2,
        amount: 10000,
        remarks: 'Payment for joki tugas koding dan paper research bruhh services',
        balance_before: 20000,
        balance_after: 10000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Transfers', null, {});
  }
};
