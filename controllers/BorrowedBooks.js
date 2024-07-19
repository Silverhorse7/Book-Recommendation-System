const BorrowedBook = require("../models").BorrowedBook;
const { Op } = require("sequelize");

const BorrowBookController = {
  showTransactions(req, res, next) {
    return BorrowedBook.findAll()
      .then((transactions) => res.status(200).json(transactions))
      .catch((error) => next(error));
  },
};

module.exports = BorrowBookController;
