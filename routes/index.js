const express = require("express");
const UserController = require("../controllers/UserController");
const BookController = require("../controllers/BookController");
const BorrowBookController = require("../controllers/BorrowedBooks");

const authenticate = require("../middleware/authenticate");
const ensureIsAdmin = require("../middleware/ensureIsAdmin");
const validateInput = require("../middleware/validateInput");

const router = express.Router();

router
  .get("/", (req, res) =>
    res.status(200).send({
      message: "Welcome to the Hello Books API!",
    })
  )
  // Unprotected routes
  .post("/signup", validateInput.signup, UserController.createUser)
  .post("/signin", validateInput.signin, UserController.getUser)
  .get("/users", authenticate, ensureIsAdmin, UserController.getUsers)

  .get("/books", authenticate, BookController.getBooks)
  .post(
    "/range",
    authenticate,
    ensureIsAdmin,
    validateInput.validateRange,
    BookController.addRange
  )
  .post("/book", authenticate, ensureIsAdmin, BookController.createBook)

  .get(
    "/transactions",
    authenticate,
    ensureIsAdmin,
    BorrowBookController.showTransactions
  )

  // Send a message if route does not exist
  .get("*", (req, res) =>
    res.status(404).send({
      message: "Seems like you might be lost",
    })
  );

// m

module.exports = router;
