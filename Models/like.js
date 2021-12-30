'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      // define association here
      Like.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete:'cascade'
      });
      Like.belongsTo(models.Thread, {
        foreignKey: 'threadId',
        onDelete:'cascade'
      });
      Like.belongsTo(models.Comment, {
        foreignKey: 'commentId',
        onDelete:'cascade'
      })
    }
  };
  Like.init({
    userId: DataTypes.INTEGER,
    threadId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};