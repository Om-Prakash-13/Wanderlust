const express = require('express');
const router = express.Router();
const Listings = require('../models/listing.js');
const Reservations = require('../models/reservation.js');
const wrapAsync = require('../util/wrapAsync.js');
const { isLogedIn,validateReservation } = require('../middleware.js');


router.post("/grant/:id", async (req,res) => {
    let {id} = req.params;
    let update = await Reservations.findByIdAndUpdate(id,{status : "confirmed"});
    res.redirect("/profile");
});

const getDays = (date1, date2) => {
    date1 = new Date(date1);
    date2 = new Date(date2);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    console.log(diffTime + " milliseconds");
    console.log(diffDays + " days");
    return diffDays;
}

router.post("/:listingid", isLogedIn, validateReservation, wrapAsync(async (req,res) => {
    let {listingid} = req.params;
    let listing = await Listings.findById(listingid);
    let reservationDetails = req.body;
    let reservation = {
        checkin : reservationDetails.checkin,
        checkout : reservationDetails.checkout,
        guestNumber : reservationDetails.guests,
        property : listingid,
        owner : listing.owner,
        guest : req.user._id,
        status : "pending",
        price : listing.price * getDays(reservationDetails.checkin, reservationDetails.checkout)
    }
    reservation = new Reservations({...reservation});
    reservation = await reservation.save();
    req.flash("success","Your reservation reqest is accepted and in pending state. We will reach you soon.");
    res.redirect(`/listings/${req.params.listingid}`)
}));

module.exports = router;