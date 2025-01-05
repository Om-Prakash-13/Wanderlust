const express = require('express');
const router = express.Router();
const wrapAsync = require('../util/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/user.js')
const Listings = require('../models/listing.js');
const Reservation = require('../models/reservation.js');

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

router.get("/profile", wrapAsync(async(req,res) => {
    let bookings = await Reservation.find({guest : req.user._id}).populate('property');
    let properties = await Listings.find({owner : req.user._id});
    let reservationRequests = await Reservation.find({$and: [{owner : req.user._id},{status : 'pending'}]}).populate('property');

    res.render("Users/dashboard",{user : req.user, bookings, properties, reservationRequests});
}));

module.exports = router;