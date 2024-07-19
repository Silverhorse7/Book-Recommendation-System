const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("../models").User;
const Book = require("../models").Book;
const getJWT = require("../helpers/helpers").getJWT;
const { Op } = require("sequelize");
const BorrowedBook = require("../models").BorrowedBook;

dotenv.config();

const UserController = {
  
  createUser(req, res, next) {
    // uncomment when production
    // delete req.body.isAdmin;
    const email = req.body.email;
    return User.findOne({
      where: { email },
    })
      .catch((error) => {
        return res.status(400).json({ message: error.message });
      })
      .then((existingUser) => {
        if (existingUser && existingUser.email === email) {
          return res.status(409).json({
            message: "email is associated with an account",
          });
        }
        User.create(req.body)
          .then((user) => {
            const { id, isAdmin } = user;
            const jwtOptions = { id, email, isAdmin };
            const token = getJWT(jwtOptions);
            return res.status(201).json({
              token,
              id,
              isAdmin,
              message: `Welcome ${email}. This is your dashboard`,
            });
          })
          .catch((error) => next(error));
      })
      .catch((error) => next(error));
  },

  getUser(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    return User.findOne({ where: { email } })
      .then((user) => {
        if (!user) {
          if (req.body.authId) {
            return UserController.createUser(req, res);
          }
          return res.status(401).send({
            message: "user does not exist",
          });
        }
        bcrypt
          .compare(password, user.password)
          .then((result) => {
            if (!result) {
              return res.status(401).send({
                message: "wrong username and password combination",
              });
            }
            const { id, email, isAdmin } = user;
            const jwtOptions = { id, email, isAdmin };
            const token = getJWT(jwtOptions);
            return res.status(200).json({
              token,
              id,
              isAdmin,
              message: `Welcome back ${email}`,
            });
          })
          .catch((error) => next(error));
      })
      .catch((error) => next(error));
  },

  getUsers(_, res, next) {
    // return User.findAll()
    //   .then((users) => res.status(200).json(users))
    //   .catch((error) => next(error));

    // exclude password, passwordResetToken, authId

    return User.findAll({
      attributes: {
        exclude: ["password", "passwordResetToken", "authId"],
      },
    })
      .then((users) => res.status(200).json(users))
      .catch((error) => next(error));
  },
};

module.exports = UserController;
