const deepClone = require("deepclonejs");
const bcrypt = require("bcrypt");

const User = require("../models").User;
const isReset = require("./authenticate").isReset;

const validator = require("validator");


/**
 * deletes empty fields in object
 */
const deleteEmptyFields = (object) => {
  const clonedObject = deepClone(object);
  const fields = Object.keys(clonedObject);
  fields.forEach((field) => {
    if (clonedObject[field] === (null || undefined || "")) {
      delete clonedObject[field];
    }
  });
  return clonedObject;
};

/**
 * trims string values in object
 */
const trimFields = (object) => {
  const clonedObject = deepClone(object);
  const fields = Object.keys(clonedObject);
  fields.forEach((field) => {
    if (typeof clonedObject[field] === "string") {
      clonedObject[field] = clonedObject[field].trim();
    }
  });
  return clonedObject;
};

/**
 * checks if password matches that associated with user
 */
const passwordIsCorrect = (id, password) =>
  User.findById(id).then((user) => bcrypt.compare(password, user.password));

/**
 * checks if Password reset token has been unusedToken
 */
const unusedToken = (id, token) =>
  User.findById(id).then((user) => user.passwordResetToken === token);

function isValidEmail(email) {
  return validator.isEmail(email);
}


/**
 * input validation middleware
 */
module.exports = {
  /**
   * validates fields on request to update user data
   */
  updateUser(req, res, next) {
    req.body = deleteEmptyFields(trimFields(req.body));
    delete req.body.id;
    delete req.body.isAdmin;
    if (req.body.password && req.body.newPassword) {
      passwordIsCorrect(req.user.id, req.body.password)
        .then((correct) => {
          if (!correct) {
            return res.status(422).send({
              message: "Wrong password provided",
            });
          }
          req.body.password = req.body.newPassword;
          next();
        })
        .catch(() =>
          res.status(500).send({
            message: "an error occured while trying to update your information",
          })
        );
    } else if (isReset(req)) {
      unusedToken(req.user.id, req.params.token).then((tokenStatus) => {
        if (!tokenStatus) {
          return res.status(422).send({
            message: "This link has been used already",
          });
        }
        next();
      });
    } else {
      delete req.body.password;
      next();
    }
  },

  /**
   * validates fields on request to signup user
   */
  signup(req, res, next) {
    req.body = deleteEmptyFields(trimFields(req.body));
    delete req.body.id;
    // delete req.body.isAdmin;
    req.body.username = req.body.username && req.body.username.toLowerCase();
    const { password, email, confirmPassword } = req.body;

    if (!password || typeof password !== "string") {
      return res.status(400).send({
        message: "Password is required",
      });
    } else if (!email) {
      return res.status(400).send({
        message: "Email is required",
      });
    } else if (!isValidEmail(email)) {
      return res.status(400).send({
        message: "Invalid Email",
      });
    } else if (!(password === confirmPassword)) {
      return res.status(400).send({
        message: "Passwords do not match",
      });
    }
    next();
  },

  /**
   * validates fields on signin request
   */
  signin(req, res, next) {
    req.body = deleteEmptyFields(trimFields(req.body));
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({
        message: "Email is required",
      });
    } else if (!isValidEmail(email)) {
      return res.status(400).send({
        message: "Invalid Email",
      });
    } else if (!password || typeof password !== "string") {
      return res.status(400).send({
        message: "Password is required",
      });
    }
    next();
  },

  /**
   * validates fields on requestPasswordReset

   */
  requestPasswordReset(req, res, next) {
    req.body = deleteEmptyFields(trimFields(req.body));
    if (!req.body.email) {
      return res.status(400).send({ message: "Email cannot be empty" });
    }
    next();
  },

  /**
   * validates fields on addBook
   */
  addBook(req, res, next) {
    req.body = deleteEmptyFields(trimFields(req.body));

    if (!req.body.title) {
      return res.status(400).send({
        message: "Book must have a title",
      });
    }

    next();
  },

  /**
   * validates fields on updateBook
   */
  updateBook(req, res, next) {
    req.body = deleteEmptyFields(trimFields(req.body));
    if (!Object.keys(req.body).length) {
      return res.status(400).send({ message: "Nothing to update" });
    }
    next();
  },

  /**
   * validates id params
   */
  validateId(req, res, next) {
    if (req.body.id && !Number.isInteger(Number(req.body.id))) {
      return res.status(400).send({
        message: "Id must be an integer",
      });
    }
    if (req.params.id && !Number.isInteger(Number(req.params.id))) {
      return res.status(400).send({
        message: "Id must be an integer",
      });
    }
    next();
  },

  validateRange(req, res, next) {

    if (!Number.isInteger(Number(req.body.book_id))) { 
      return res.status(400).send({
        message: "Id must be an integer",
      });
    }
    if (!Number.isInteger(Number(req.body.start_page))) {
      return res.status(400).send({
        message: "Left must be an integer",
      });
    }
    if (!Number.isInteger(Number(req.body.end_page))) {
      return res.status(400).send({
        message: "Right must be an integer",
      });
    }

    if (req.body.start_page > req.body.end_page) { // check if start page is greater than end page
      return res.status(400).send({
        message: "Start page must be less than end page",
      });
    }

    if (req.body.start_page < 0 || req.body.end_page < 0) { // check for negative page numbers
      return res.status(400).send({
        message: "Page numbers must be positive",
      });
    }

    next();
  },
};
