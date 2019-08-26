'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Mails', {
      mailId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mailContent: {
        type: Sequelize.TEXT  
      },
      mailAliasId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'MailAliases',
          key: 'mailAliasId'
        },
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
    return queryInterface.dropTable('Mails');
  }
};