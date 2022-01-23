module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'user_roles',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        created_at: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()'),
        },
        updated_at: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()'),
        },
        deleted_at: {
          type: Sequelize.DataTypes.DATE,
          allowNull: true,
        },
      },
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_roles');
  },
};
