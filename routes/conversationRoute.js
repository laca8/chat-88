const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const User = require("../models/User");
//new conv
router.post("/", async (req, res) => {
  try {
    const conves = await Conversation.find({});
    const f1 = conves.find((a) =>
      a.members.find((b) => b == req.body.senderId)
    );
    const f2 = conves.find((a) =>
      a.members.find((b) => b == req.body.recieverId)
    );
    const ti = req.body.senderId;
    const ty = req.body.recieverId;
    console.log({ ti, ty });

    if (ti || tf) {
      const newConversation = await new Conversation({
        members: [req.body.senderId, req.body.recieverId],
      });
      await newConversation.save();
      res.json(newConversation);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
});
//get conv of a user
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.json(conversation);
  } catch (err) {
    // console.log(err);
    res.status(500).json({ msg: err });
  }
});

module.exports = router;
