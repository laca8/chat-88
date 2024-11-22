const Message = require("../models/Message");
const User = require("../models/User");
const cloudinary = require("../lib/cloudinary");
const { getReceiverSocketId, io } = require("../lib/socket");

const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filterUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filterUsers);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "invaild server error " });
  }
};
const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    const messages = await Message.find({
      $or: [
        {
          senderId: senderId,
          recieverId: userToChatId,
        },
        {
          senderId: userToChatId,
          recieverId: senderId,
        },
      ],
    });
    res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "invaild server error " });
  }
};
const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      //upload base64 image to cloudinary
      const uploadRes = await cloudinary.uploader.upload(image);
      imageUrl = uploadRes.secure_url;
    }
    const newMessage = new Message({
      senderId,
      recieverId,
      text,
      image: imageUrl,
    });
    newMessage.save();

    const receiverSocketId = getReceiverSocketId(recieverId);

    io.emit("newMessage", newMessage);

    res.status(200).json(newMessage);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "invaild server error " });
  }
};
module.exports = {
  getUsersForSidebar,
  getMessages,
  sendMessage,
};
