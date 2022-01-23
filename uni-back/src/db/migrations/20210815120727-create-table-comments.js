'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'comments',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        post_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'posts', key: 'id' },
        },
        owner_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
        },
        content: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        parent_comment_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'comments', key: 'id', allowNull: true },
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
    return queryInterface.dropTable('comments');
  },
};
