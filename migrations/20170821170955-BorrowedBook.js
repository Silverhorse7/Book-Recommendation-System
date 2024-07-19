module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable("BorrowedBooks", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      left: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      right: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      bookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Books",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down(queryInterface, /*Sequelize */) {
    return queryInterface.dropTable("BorrowedBooks");
  },
};
