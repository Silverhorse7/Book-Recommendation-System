module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      "Users",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        email: {
          allowNull: false,
          type: Sequelize.STRING,
          unique: true,
        },
        password: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        isAdmin: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        passwordResetToken: {
          type: Sequelize.STRING,
        },
        authId: {
          type: Sequelize.STRING,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        timestamps: true, // disable timestamps
      }
    );
  },
  down(queryInterface /* , Sequelize */) {
    return queryInterface.dropTable("Users");
  },
};
