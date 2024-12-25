const express = require('express');
const router = express.Router();
const Listings = require("../models/listing.js");
const wrapAsync = require('../util/wrapAsync.js');

router.post("/", wrapAsync( async (req,res) => {
    let filterdListings = await Listings.find({ filterOption: req.body.filter });
    if(!filterdListings.length){
        req.flash("failure",`No property with ${req.body.filter}`);
        return res.redirect("/listings");
    }
    res.render("Listings/index",{allListings : filterdListings});
    })
);

module.exports = router;