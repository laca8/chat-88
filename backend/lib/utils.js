const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const createToken = (payload, res) => {
  const token = jwt.sign({ userId: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return res.status(200).json(token);
};

module.exports = createToken;
