module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      "Books",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING,
          unique: true,
        },
        num_of_pages: {
          type: Sequelize.INTEGER,
        },
        num_of_read_pages: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
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
    );


  },
  down(queryInterface /* , Sequelize */) {
    return queryInterface.dropTable("Books");
  },
};