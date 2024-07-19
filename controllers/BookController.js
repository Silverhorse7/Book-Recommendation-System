// import { Book, BorrowedBook, BookCategory, Notification } from '../models';
// import { getQuery, getOptions, paginate } from '../helpers/pagination';

const { sequelize } = require("../models");

var Book = require("../models").Book;
var User = require("../models").User;
const BorrowedBook = require("../models").BorrowedBook;
const { Op } = require("sequelize");

const BookController = {
  createBook(req, res, next) {
    // title, num_pages
    return Book.create(req.body)
      .then((book) => res.status(201).json(book))
      .catch((error) => next(error));
  },

  addRange(req, res, next) {
    const { _, book_id, start_page, end_page } = req.body;

    return sequelize
      .transaction(async (t) => {
        const book = await Book.findOne({
          where: { id: book_id },
          transaction: t,
        });
        if (!book) {
          throw new Error("Book not found");
        }

        // Check if end_page is less than or equal to the book's total pages
        if (end_page > book.num_of_pages) {
          throw new Error("End page exceeds the book's total pages");
        }

        const [minRange, maxRange] = await Promise.all([
          BorrowedBook.findOne({
            where: {
              bookId: book_id,
              left: { [Op.lte]: end_page },
              right: { [Op.gte]: start_page },
            },
            order: [["left", "ASC"]],
            transaction: t,
          }),
          BorrowedBook.findOne({
            where: {
              bookId: book_id,
              left: { [Op.lte]: end_page },
              right: { [Op.gte]: start_page },
            },
            order: [["right", "DESC"]],
            transaction: t,
          }),
        ]);

        const newLeft = minRange
          ? Math.min(start_page, minRange.left)
          : start_page;
        const newRight = maxRange
          ? Math.max(end_page, maxRange.right)
          : end_page;

        // Calculate pages to be deleted
        const rangesToDelete = await BorrowedBook.findAll({
          where: {
            bookId: book_id,
            [Op.or]: [
              { left: { [Op.between]: [newLeft, newRight] } },
              { right: { [Op.between]: [newLeft, newRight] } },
              {
                [Op.and]: [
                  { left: { [Op.lte]: newLeft } },
                  { right: { [Op.gte]: newRight } },
                ],
              },
            ],
          },
          transaction: t,
        });

        const deletedPages = rangesToDelete.reduce(
          (sum, range) => sum + (range.right - range.left + 1),
          0
        );

        // Delete the ranges
        await BorrowedBook.destroy({
          where: {
            id: rangesToDelete.map((range) => range.id),
          },
          transaction: t,
        });

        // Create new range
        await BorrowedBook.create(
          { bookId: book_id, left: newLeft, right: newRight },
          { transaction: t }
        );

        const addedPages = newRight - newLeft + 1;
        book.num_of_read_pages += addedPages - deletedPages;
        await book.save({ transaction: t });

        return book;
      })
      .then((book) => {
        res
          .status(201)
          .json({ message: "success", pages_read: end_page - start_page + 1});
      })
      .catch((error) => {
        if (error.message === "Book not found") {
          res.status(404).json({ message: error.message });
        } else if (
          error.message === "End page exceeds the book's total pages"
        ) {
          res.status(400).json({ message: error.message });
        } else {
          next(error);
        }
      });
  },
  getBooks(_, res, next) {
    // return top 10 books from Book table sorted by num_of_read_pages
    return Book.findAll({
      order: [["num_of_read_pages", "DESC"]],
      limit: 10,
    })
      .then((books) => res.status(200).json(books))
      .catch((error) => next(error));
  },
};

module.exports = BookController;
