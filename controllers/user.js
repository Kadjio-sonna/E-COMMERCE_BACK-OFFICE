const CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");

const { User } = require("../models/User");

// UPDATE USER
exports.updateUser = async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSWORD_SECRET
        ).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: { ...req.body },
            },
            { new: true }
        );

        res.status(200).json({ Data: updatedUser });
    } catch (error) {
        res.status(500).json({ Error: error });
    }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
    try {
        if (req.params.id) {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({ Message: "User has been deleted!" });
        } else {
            res.status(401).json({ Error: "User not found!" });
        }
    } catch (error) {
        res.status(500).json({ Error: error });
    }
};

// GET CURRENT USER
exports.getUser = async (req, res) => {
    try {
        if (req.params.id) {
            const currentUser = await User.findById(req.params.id)
            !currentUser && res.status(401).json({ Error: "User not found!" });

            const { password, ...others } = currentUser._doc

            res.status(200).json({ Data: others });
        } else {
            res.status(401).json({ Error: "User not found!" });
        }
    } catch (error) {
        res.status(500).json({ Error: error });
    }
};
