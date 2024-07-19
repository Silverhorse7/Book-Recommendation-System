const Read = require("../models").Read;
const { Op } = require("sequelize");

const BorrowBookController = {
  showTransactions(req, res, next) {
    return Read.findAll()
      .then((transactions) => res.status(200).json(transactions))
      .catch((error) => next(error));
  },
};

module.exports = BorrowBookController;
