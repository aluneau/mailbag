'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('MailAliases', {
      mailAliasId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mailAlias: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('MailAliases');
  }
};