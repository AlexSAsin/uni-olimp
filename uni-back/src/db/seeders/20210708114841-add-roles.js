module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'user_roles',
      [
        {
          id: 1,
          name: 'admin',
        },
        {
          id: 2,
          name: 'user',
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    //  Add commands to revert seed here.
    await queryInterface.bulkDelete('user_roles', { id: 1 }, {});
    await queryInterface.bulkDelete('user_roles', { id: 2 }, {});
  },
};
