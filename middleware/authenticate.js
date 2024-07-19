// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const getToken = (req) => {
  const token =
    req.body.token ||
    req.headers["x-access-token"] ||
    (req.headers.Authorization && req.headers.Authorization.slice(7)) ||
    req.params.token;
  return token;
};

const isReset = (req) =>
  req.url.match("reset-password") && getToken(req) === req.params.token;

authenticate = (req, res, next) => {
  const token = getToken(req);
  if (token) {
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          if (isReset(req)) {
            return res.status(401).json({
              message: "Your link has expired. Please get a new link",
            });
          }
          return res.status(401).json({
            message: "Your session has expired. Please reauthenticate",
          });
        }
        return res.status(401).json({
          message: "unauthorized accesss. Login to continue",
        });
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.status(401).send({
      message: "Login to proceed",
    });
  }
};

module.exports = authenticate;
