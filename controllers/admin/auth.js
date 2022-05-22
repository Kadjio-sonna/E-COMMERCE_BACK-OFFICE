const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "kadjiologue@gmail.com",
        pass: "kadjiologue123",
    },
});

const code = require("../../routes/generateCode");

const { User } = require("../../models/User");
const { param } = require("../../routes/user/auth");


// const isAuth = (res, req, next) => {
//     if (req.session.isAuth) {
//         next();
//     } else {
//         res.redirect("/dashboard/login");
//     }
// };


// REGISTER ADMIN
exports.createAdmin = async (req, res) => {
    // console.log("Req: ", code())
    // console.log("url: ", req.rawHeaders[15])
    const url = req.rawHeaders[15];

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
        userType: "admin",
        otp: code(),
        isAdmin: true,
        status: false,
    });
    // console.log(newUser);
    // console.log("cgu: ", req.body.termscgu);
    if (req.body) {
        try {
            let savedUser = await newUser.save((err, user) => {
                if (err) {
                    res.status(400).json({ type: "danger", message: err.message });
                } else {
                    console.log("User : ", user);
                    const mailOptions = {
                        from: "kadjiologue@gmail.com", // sender address
                        to: newUser.email, // list of receivers
                        subject: "Comfirmation de votre compte!", // Subject line
                        html: `<form action=''><div>Cliquez sur ce lien pour activer votre compte <button><a href='${url}/dashboard/verification-code/${user._id}'>Click</a></button></div> </form>`, // plain text body
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
                            res.redirect("/dashboard/verification-code/" + user._id);
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
            // res.status(500).json({ Error: error });
            req.session.message = {
                type: "danger",
                message: error,
            };
        }
    } else {
        // res.status(400).json({ Error: "Cannot save user" });
        req.session.message = {
            type: "danger",
            message: "Cannot save user!",
        };
    }
};

// LOGIN ADMIN
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(email, password);
        const user = await User.findOne({ email: email });

        if (!user) {
            req.session.message = {
                type: "danger",
                message: "User not found!",
            };
            res.redirect("/dashboard/login");
        } else {
            const hashedPassword = CryptoJS.AES.decrypt(
                user.password,
                process.env.PASSWORD_SECRET
            );

            const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
            if (originalPassword !== password) {
                req.session.message = {
                    type: "danger",
                    message: "Invalid Password!",
                };

                res.redirect("/dashboard/login");

                // res.redirect(401, "/dashboard/login")
                // res.status(401).end();

            } else {
                // Generer le token avec les proprietes #_id et #isAdmin
                const accessToken = jwt.sign(
                    { id: user._id, isAdmin: user.isAdmin },
                    process.env.JWT_SECRET,
                    { expiresIn: "1d" }
                );

                // Pour enregistrer #isAuth dans la collection mySessions en #BD
                // console.log(req.session)
                // console.log(req.session.id)
                req.session.isAuth = true

                const { password, ...others } = user._doc;

                req.session.message = {
                    type: "success",
                    message: "Connection successfully!",
                };
                res.redirect("/dashboard");

                // res.status(200).json({
                //     Message: "Connection successfully",
                //     Data: { ...others, accessToken },
                // });
            }
        }
    } catch (error) {
        // res.status(500).json({ Error: error });
        req.session.message = {
            type: "danger",
            message: error,
        };
    }
};

// Verification du code OPT
exports.verificationCode = async (req, res) => {
    const code =
        req.body.first +
        "" +
        req.body.second +
        "" +
        req.body.third +
        "" +
        req.body.fourth +
        "" +
        req.body.fifth +
        "" +
        req.body.sixth;

    console.log(code);
    // console.log(req.params.userId);
    if (code && req.params.userId) {
        try {
            await User.updateOne(
                { _id: req.params.userId, otp: code },
                { $set: { status: true } }
            );
            // await User.updateOne({ _id: req.params.userId }, { $set: { status: otp === code ? true : false } })

            // Load the document to see the updated value
            const doc = await User.findOne();
            if (doc.status === true) {
                console.log("activeStatus: ", doc.status);
                req.session.message = {
                    type: "success",
                    message: "Votre compte a été activé avec success!",
                };
                // res.redirect("/dashboard/verification-code/" + req.params.userId);
                res.redirect("/dashboard/login");
            } else {
                req.session.message = {
                    type: "danger",
                    message: "Votre code d'activation est incorrect!",
                };
                res.redirect("/dashboard/verification-code/" + req.params.userId);
            }
        } catch (error) {
            console.log(error);
            req.session.message = {
                type: "danger",
                message: "Erreur survenue!",
            };

            res.redirect("/dashboard/verification-code/" + req.params.userId);
        }
    } else {
        req.session.message = {
            type: "danger",
            message: "Veuillez entrer votre code d'activation!",
        };
        res.redirect("/dashboard/verification-code/" + req.params.userId);
        // console.log("Veuillez entrer votre code d'activation!")
    }
};
