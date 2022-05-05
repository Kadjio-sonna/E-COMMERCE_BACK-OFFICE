const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "kadjiologue@gmail.com",
        pass: "kadjiologue123",
    },
});

const { User } = require("../../models/User");

// REGISTER ADMIN
exports.createAdmin = async (req, res) => {
    const newUser = new User({
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        username: req.body.firstname + " " + req.body.lastname,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSWORD_SECRET
        ).toString(),
        termsCgu: req.body.termscgu && req.body.termscgu == "on" ? true : false,
        userType: req.body.termscgu == "on" ? 'admin' : 'user',
        otp: "111000",
        isAdmin: true,
    });
    console.log(newUser);
    console.log("cgu: ", req.body.termscgu);
    if (req.body) {
        try {
            const savedUser = await newUser.save((err) => {
                if (err) {
                    res.status(400).json({ type: "danger", message: err.message });
                } else {
                    const mailOptions = {
                        from: "kadjiologue@gmail.com", // sender address
                        to: newUser.email, // list of receivers
                        subject: "Comfirmation de votre compte!", // Subject line
                        html: "<p>Cliquez sur ce lien pour activer votre compte </p>", // plain text body
                    };
                    console.log(mailOptions);
                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            console.log("Erreur: ", err);
                            req.session.message = {
                                type: "danger",
                                message: "Erreur survenue!",
                            };
                        } else {

                            console.log("Info: ", info);
                            req.session.message = {
                                type: "success",
                                message:
                                    "User succesfull created, please check your email to activate your account!",
                            };
                            res.redirect("/dashboard/register");
                        }
                    });

                    // req.session.message = {
                    //     type: "success",
                    //     message: "User succesfull created, please check your email to activate your account!",
                    // };
                    // res.redirect("/dashboard/register");
                }
            });
        } catch (error) {
            res.status(500).json({ Error: error });
        }
    } else {
        res.status(400).json({ Error: "Cannot save user" });
    }
};

// LOGIN ADMIN
exports.loginAdmin = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json({ Error: "User not found!" });

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASSWORD_SECRET
        );

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        originalPassword !== req.body.password &&
            res.status(401).json({ Error: "Invalid Password!" });

        const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const { password, ...others } = user._doc;
        res.status(200).json({
            Message: "Connection successfully",
            Data: { ...others, accessToken },
        });
    } catch (error) {
        res.status(500).json({ Error: error });
    }
};
