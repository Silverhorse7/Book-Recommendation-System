module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    num_of_pages: {
      type: DataTypes.INTEGER,
    },
    num_of_read_pages: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  Book.associate = (models) => {
    Book.hasMany(models.BorrowedBook, {
      foreignKey: "bookId",
      as: "borrowedBooks",
    });
  };

  return Book;
};
