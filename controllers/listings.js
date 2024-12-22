const Listings = require('../models/listing');
const mbxGeocoading = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoading({ accessToken: mapToken });

module.exports.renderIndex = async (req,res) => {
    let allListings = await Listings.find()
    res.render("Listings/index",{allListings});
}

module.exports.renderNewListingForm = (req,res) => {
    res.render("Listings/newListing");
}

module.exports.saveNewListing = async (req,res,next) => {
    let {listing} = req.body;
    let mapResponce = await geocodingClient.forwardGeocode({
        query: listing.location,
        limit: 1
    })
    .send()
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listings(listing);
    newListing.image = {url,filename};
    newListing.owner = req.user._id;
    newListing.geometry = mapResponce.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "Congratulations ! New listing created Sucessfully.");
    res.redirect("/listings");
}

module.exports.renderEditListingsForm = async (req,res) => {
    let {id} = req.params;
    let listing = await Listings.findById(id);
    if(!listing){
        req.flash("failure", "The Listing you want to open doesn't exists.");
        return res.redirect("/listings");
    }
    listing.image.url = listing.image.url.replace("/upload","/upload/w_250");
    res.render("Listings/editListing",{listing});
}

module.exports.editListingDetails = async (req,res) => {
    let {id} = req.params;
    let listingBeforeEdit = await Listings.findById(id);
    listingFilterType = listingBeforeEdit.filterOption;
    let{listing} = req.body;
    listing = await Listings.findByIdAndUpdate(id,{...listing});
    if(!listing.filterOption){
        listing.filterOption = listingFilterType;
    }
    let mapResponce = await geocodingClient.forwardGeocode({
        query: listing.location,
        limit: 1
    })
    .send()
    listing.geometry = mapResponce.body.features[0].geometry;
    await listing.save();
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Congratulations ! Listing Edited Sucessfully.");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res) => {
    let{id} = req.params;
    let listing = await Listings.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Sucessfully.");
    res.redirect("/listings");
}

module.exports.showListingDetails = async (req,res) => {
    let {id} = req.params;
    let openedListing = await Listings.findById(id)
        .populate({
            path : "reviews",
            populate : {
                path : "author"
            }
        })
        .populate("owner");
    if(!openedListing){
        req.flash("failure", "The Listing you want to open doesn't exists.");
        return res.redirect("/listings");
    }
    res.render("Listings/show",{listing : openedListing});
}