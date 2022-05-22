const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");

const userCtrl = require("../../controllers/admin/admin")
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../verifyToken")

const { isAuth } = require("../authenticate");

router.get("/", isAuth, (req, res) => {
    res.render("index", { title: "Home page" })
})

router.get("/users", (req, res) => {
    res.render("user/users", { title: "Liste des utilisateur" })
})

router.get("/user/:id", (req, res) => {
    const id = req.params.id
    console.log(id)
    res.render("user/detail_user", { title: id })
})
module.exports = router;