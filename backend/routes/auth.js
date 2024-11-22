const express = require("express");
const router = express.Router();
const authCntrl = require("../controller/auth");
const authProtect = require("../midlewares/authProtect");
router.post("/signup", authCntrl.signUp);
router.post("/login", authCntrl.login);

router.put("/profile", authProtect, authCntrl.updateProfile);
module.exports = router;
