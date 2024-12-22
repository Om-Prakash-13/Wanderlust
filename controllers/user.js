const Users = require('../models/user.js');

module.exports.renderSignUpPage = (req,res) => {
    res.render("Users/signUpForm");
}

module.exports.renderLogInPage = (req,res) => {
    res.render("Users/logInForm.ejs");
}

module.exports.signupNewUser = async (req,res) => {
    try{
        let { email, username, password } = req.body;

        let newUser = new Users({username, email});
        let registeredUser = await Users.register(newUser, password);
        req.login(registeredUser, (err) =>{
            if(err) throw err;
            req.flash("success", `Hello ${username}, Welcome to Wanderlust !`);
            res.redirect("/listings");
        });
    }catch(err){
        req.flash("failure",err.message);
        return res.redirect("/signup");
    }
}

module.exports.loginRedirect = (req, res) => {
    req.flash("success", `Hello ${req.body.username}, Welcome back to Wanderlust!`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next) => {
    req.logOut((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","You Logged out Sucessfuly !");
        res.redirect("/listings");
    });
}