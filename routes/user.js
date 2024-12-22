const express = require('express');
const router = express.Router();
const wrapAsync = require('../util/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/user.js')

router
    .route("/signup")
    .get(userController.renderSignUpPage)
    .post(wrapAsync(userController.signupNewUser));

router
    .route("/login")
    .get(userController.renderLogInPage)
    .post(
        saveRedirectUrl,
        passport.authenticate('local', {
            failureRedirect : '/login', 
            failureFlash : true,
            failureMessage : true
        }),
        userController.loginRedirect
    );

router.get("/logout", userController.logout);

module.exports = router;