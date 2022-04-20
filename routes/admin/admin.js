const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");

const userCtrl = require("../../controllers/user")
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../verifyToken")

router.get("/", (req, res) => {
    res.render("index", { title: "Home page" })
})
module.exports = router;