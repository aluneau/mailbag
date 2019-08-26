'use strict';

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    userName: {
      type: DataTypes.STRING,
      unique: true
    },
    passwordHash: DataTypes.STRING
  }, {});
  Users.associate = function(models) {
    models.MailAliases.belongsTo(Users, {foreignKey: 'userId'})
    Users.hasMany(models.MailAliases, {foreignKey:'userId'});
  };
  module.exports = Users
  return Users;
};

