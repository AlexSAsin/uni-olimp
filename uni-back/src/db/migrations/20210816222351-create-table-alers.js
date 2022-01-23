'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'alerts',
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
        level: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        reason: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        viewed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
        },

        post_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'posts', key: 'id', allowNull: true },
        },
        comment1_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'comments', key: 'id', allowNull: true },
        },
        comment2_id: {
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
    return queryInterface.dropTable('alerts');
  },
};
