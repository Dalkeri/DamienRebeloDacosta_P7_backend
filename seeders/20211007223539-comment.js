'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Comments', [
      {
        content: "first comment",
        visible: true,
        userId: 1,
        threadId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        content: "second comment",
        visible: true,
        userId: 2,
        threadId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        content: "third comment",
        visible: true,
        userId: 2,
        threadId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        content: "fourth comment",
        visible: true,
        userId: 1,
        threadId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
