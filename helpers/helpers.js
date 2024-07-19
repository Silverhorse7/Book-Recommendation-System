const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hashPassword = (user) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return user;
};

const getJWT = (options, expiresIn = Number(process.env.JWT_EXPIRATION)) =>
  jwt.sign({ ...options }, process.env.SECRET, { expiresIn });

module.exports = { hashPassword, getJWT };
