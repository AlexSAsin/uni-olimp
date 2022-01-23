module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'posts',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        views_count: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        owner_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
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
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('posts');
  },
};
