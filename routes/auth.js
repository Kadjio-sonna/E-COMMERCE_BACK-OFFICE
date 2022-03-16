
const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");

const authCtrl = require("../controllers/auth")

router.post("/user/register", authCtrl.createUser)
router.post("/user/login", authCtrl.loginUser)

module.exports = router;