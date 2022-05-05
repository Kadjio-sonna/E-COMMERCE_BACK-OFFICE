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

router.post("/login", (req, res) => {
    res.redirect("/users");
});

// Opt code
router.get("/verification-code", (req, res) => {
    res.render("code", { title: "Code page" });
});

module.exports = router;
