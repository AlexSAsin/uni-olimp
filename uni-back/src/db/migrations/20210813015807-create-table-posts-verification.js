'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'posts_verifications',
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
        result: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        reason: {
          type: Sequelize.STRING,
          allowNull: true,
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
    return queryInterface.dropTable('posts_verifications');
  },
};
