const express = require("express");
const router = express.Router();
const msgCntrl = require("../controller/message");
const authProtect = require("../midlewares/authProtect");
router.get("/users", authProtect, msgCntrl.getUsersForSidebar);
router.get("/:id", authProtect, msgCntrl.getMessages);
router.post("/send/:id", authProtect, msgCntrl.sendMessage);
module.exports = router;
