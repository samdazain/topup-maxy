'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transfer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transfer.init({
    sender_id: DataTypes.INTEGER,
    target_user: DataTypes.UUID,
    amount: DataTypes.INTEGER,
    remarks: DataTypes.STRING,
    balance_before: DataTypes.INTEGER,
    balance_after: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transfer',
  });
  return Transfer;
};