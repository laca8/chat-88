const createToken = require("../lib/utils");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const cloudinary = require("../lib/cloudinary");
const signUp = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    if (!password || !email || !fullName) {
      return res.status(400).json({ message: "all fields required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password length must be at least 6 charcters" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "email is already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    const token = await jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    if (newUser) {
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        token: token,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "error in signup" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "invaild server error " });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!password || !email) {
      return res.status(400).json({ message: "all fields required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(201).json({
      _id: user._id,
      token: token,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "invaild server error " });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    // console.log(profilePic);

    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "profile pic is required" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(profilePic);
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: result.secure_url },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "invaild server error " });
  }
};
module.exports = {
  signUp,
  login,

  updateProfile,
};
