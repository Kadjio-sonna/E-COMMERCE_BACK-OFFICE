const CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");

const { User } = require("../models/User");

// REGISTER USER
exports.createUser = async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSWORD_SECRET
        ).toString(),
    });
    if (req.body) {
        try {
            const savedUser = await newUser.save();
            const { password, ...others } = savedUser._doc;
            res.status(201).json({ msg: "User succesfull created", data: others });
        } catch (error) {
            res.status(500).json({ Error: error });
        }
    } else {
        res.status(400).json({ Error: "Cannot save user" });
    }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json({ Error: "User not found!" });

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASSWORD_SECRET
        );

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        originalPassword !== req.body.password && res.status(401).json({ Error: "Invalid Password!" });

        const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const { password, ...others } = user._doc;
        res.status(200).json({ Message: "Connection successfully", Data: { ...others, accessToken } });
    } catch (error) {
        res.status(500).json({ Error: error });
    }
};
