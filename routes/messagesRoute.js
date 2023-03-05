const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
//add
router.post("/", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    // console.log(err);
    res.status(500).json({ msg: err });
  }
});
//get
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.json(messages);
  } catch (err) {
    // console.log(err);
    res.status(500).json({ msg: err });
  }
});
module.exports = router;
