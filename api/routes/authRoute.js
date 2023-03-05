const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "please fill fields" });
    }
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ msg: "user already exist" });
    }

    user = await new User({
      name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = await jwt.sign({ id: user._id }, "laca", {
      expiresIn: "3d",
    });
    res.json(user);
  } catch (err) {
    //console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "invalid credintials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "invalid credintials" });
    }
    const token = await jwt.sign({ id: user._id }, "laca", {
      expiresIn: "3d",
    });
    res.json(user);
  } catch (err) {
    //console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    //console.log(err);
    res.status(500).json({ msg: err });
  }
});
module.exports = router;
