const express = require('express');
const router = express.Router();
const wrapAsync = require('../util/wrapAsync.js');
const { isLogedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer  = require('multer')
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage })

router
    .route("/")
    .get(wrapAsync(listingController.renderIndex))
    .post(
        isLogedIn, 
        upload.single('listing[image][url]'),
        validateListing,
        wrapAsync(listingController.saveNewListing)
    );

router.get("/new", isLogedIn, listingController.renderNewListingForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListingDetails))
    .put(
        isLogedIn, 
        isOwner,
        upload.single('listing[image][url]'),
        validateListing,
        wrapAsync(listingController.editListingDetails)
    )
    .delete(isLogedIn, isOwner, wrapAsync(listingController.deleteListing));

router.get("/:id/edit", isLogedIn, isOwner, wrapAsync(listingController.renderEditListingsForm));

module.exports = router;