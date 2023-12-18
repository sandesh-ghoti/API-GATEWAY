"use strict";
const { Model } = require("sequelize");
const { RoleEnum } = require("../utils/common");
const { CUSTOMER, ADMIN, FLIGHT_COMPANY } = RoleEnum;
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, {
        through: "User_Roles",
        as: "user",
        foreignKey: "roleId",
      });
    }
  }
  Role.init(
    {
      name: {
        type: DataTypes.ENUM({ values: [CUSTOMER, ADMIN, FLIGHT_COMPANY] }),
        allowNull: false,
        defaultValue: CUSTOMER,
      },
    },
    {
      sequelize,
      modelName: "Role",
    }
  );
  return Role;
};
