const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");

const authCtrl = require("../../controllers/admin/auth");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("../verifyToken");


// Register
router.get("/register", (req, res) => {
    res.render("register", { title: "Register page" });
});

router.post("/register", authCtrl.createAdmin);

// Login
router.get("/login", (req, res) => {
    res.render("login", { title: "Login page" });
});

router.post("/login", authCtrl.loginAdmin);

// Opt code
router.get("/verification-code/:userId", (req, res) => {
    res.render("code", { title: "Code page", userId: req.params.userId });
});

router.post("/verification-code/:userId", authCtrl.verificationCode);

// 404
router.get("*", (req, res) => {
    res.render("404", { title: "404 page"});
});

module.exports = router;
