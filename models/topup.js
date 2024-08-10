'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TopUp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TopUp.init({
    user_id: DataTypes.INTEGER,
    amount_top_up: DataTypes.INTEGER,
    balance_before: DataTypes.INTEGER,
    balance_after: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TopUp',
  });
  return TopUp;
};