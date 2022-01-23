'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'deleted_comments',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        comment_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'deleted_comments', key: 'id' },
        },
        reason: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('deleted_comments');
  },
};
