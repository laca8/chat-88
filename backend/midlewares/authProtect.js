const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authProtect = async (req, res, next) => {
  const token = req.headers["token"];

  if (!token) {
    return res.status(400).json({ message: "authorize error !token" });
  }
  //verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return res.status(400).json({ message: "authorize error !currentUser" });
  }

  req.user = currentUser;
  //console.log(req.user);
  next();
};

module.exports = authProtect;
