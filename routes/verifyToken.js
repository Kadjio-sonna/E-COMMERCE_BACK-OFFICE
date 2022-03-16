var jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    console.log(authHeader)
    if (authHeader) {
        const token = authHeader.split(" ")[1]
        try {
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) res.status(403).json("Token is not valid!");

                req.user = user // Ce user est #id #isAdmin que j'ai #utilise pour creer ou generer le #Token dans le #Login
                console.log(req.user)
                next();
            });
        } catch (err) {
            conole.log(err)
        }
    } else {
        res.status(401).json({ Error: "You are not authenticate!" });
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    })
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    })
};
module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
