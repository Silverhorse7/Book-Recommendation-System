module.exports = (sequelize, DataTypes) => {
  const Read = sequelize.define(
    "Read",
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

  Read.associate = (models) => {
    Read.belongsTo(models.Book, {
      foreignKey: "bookId",
      as: "book",
    });
  };

  return Read;
};
