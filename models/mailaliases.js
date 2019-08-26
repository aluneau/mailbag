'use strict';

module.exports = (sequelize, DataTypes) => {
  const MailAliases = sequelize.define('MailAliases', {
    mailAliasId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId'
      }
    },
    mailAlias: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {});
  MailAliases.associate = function(models) {
    models.Mails.belongsTo(MailAliases, {foreignKey: 'mailAliasId'})
    MailAliases.hasMany(models.Mails, {foreignKey:'mailId'});
  };
  module.exports = MailAliases;
  return MailAliases;
};