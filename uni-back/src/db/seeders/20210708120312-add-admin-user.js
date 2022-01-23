module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          login: 'admin',
          password: '$2a$12$ofh/aBe/GJ31eavy222SP.rjTH2MAnzopMKvKSVXj34QkCCemuR2q',
          role_name: 'admin',
        },
        {
          login: 'userr',
          password: '$2a$12$ofh/aBe/GJ31eavy222SP.rjTH2MAnzopMKvKSVXj34QkCCemuR2q',
          role_name: 'user',
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', { login: 'admin' }, {});
    await queryInterface.bulkDelete('users', { login: 'userr' }, {});
  },
};
