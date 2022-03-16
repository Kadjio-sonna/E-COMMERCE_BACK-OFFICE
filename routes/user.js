const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");

const userCtrl = require("../controllers/user")
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")

router.put("/user/:id", verifyTokenAndAuthorization, userCtrl.updateUser)
router.delete("/user/:id", verifyTokenAndAuthorization, userCtrl.deleteUser)
router.get("/user/find/:id", verifyTokenAndAdmin, userCtrl.getUser)


module.exports = router;