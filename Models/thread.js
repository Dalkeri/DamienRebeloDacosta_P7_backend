'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Thread extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Thread.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete:'cascade'
      });
      Thread.hasMany(models.Comment, {
        foreignKey: 'threadId',
        onDelete:'cascade'
      })
    }
  };
  Thread.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    image: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Thread',
  });
  return Thread;
};