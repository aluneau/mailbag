'use strict';

module.exports = (sequelize, DataTypes) => {
  const Mails = sequelize.define('Mails', {
    mailId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    mailAliasId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'MailAliases',
        key: 'mailAliasId'
      }
    },
    from: DataTypes.STRING,
    to: DataTypes.STRING,
    data: DataTypes.TEXT,
    date: DataTypes.DATE,
    subject: DataTypes.STRING
  }, {});
  Mails.associate = function(models) {
  };
  module.exports = Mails
  return Mails;
};