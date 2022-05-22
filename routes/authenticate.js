const isAuth = (req, res, next) => {

    // interroge la propriete #isAuth dans la collections #mySessions dans le #BD 
    if (req.session.isAuth) {
        console.log(req.session)
        console.log(req.session.id)
        next();

    } else {
        res.redirect("/dashboard/login");
    }
};

module.exports = { isAuth };
