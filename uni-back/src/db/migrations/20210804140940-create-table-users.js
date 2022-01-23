module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface
      .createTable(
        'users',
        {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          login: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          role_name: {
            type: Sequelize.STRING,
            allowNull: false,
            references: { model: 'user_roles', key: 'name' },
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('NOW()'),
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('NOW()'),
          },
          deleted_at: {
            type: Sequelize.DATE,
          },
        },
        {},
      )
      .then(() => {
        queryInterface.addConstraint('users', {
          type: 'unique',
          fields: ['login', 'deleted_at'],
          name: 'users_login_deletedat_key',
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  },
};
