// import { hashPassword } from "../helpers/helpers";
const hashPassword = require("../helpers/helpers").hashPassword;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      passwordResetToken: {
        type: DataTypes.STRING,
      },
      authId: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      
    },
    {
      hooks: {
        beforeCreate: (user) => hashPassword(user),
        beforeUpdate: (user) => {
          if (user.changed("password")) {
            user = hashPassword(user);
          }
        },
      },
    }

  );

  return User;
};
