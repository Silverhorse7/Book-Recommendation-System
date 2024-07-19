module.exports = (sequelize, DataTypes) => {
  const BorrowedBook = sequelize.define(
    "BorrowedBook",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      left: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      right: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Books",
          key: "id",
        },
      },
    },
    {
      timestamps: true,
    }
  );

  BorrowedBook.associate = (models) => {
    BorrowedBook.belongsTo(models.Book, {
      foreignKey: "bookId",
      as: "book",
    });
  };

  return BorrowedBook;
};
