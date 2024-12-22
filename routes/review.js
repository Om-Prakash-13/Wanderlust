const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../util/wrapAsync.js');
const {validateReview, isLogedIn, isAuthor} = require('../middleware.js');
const reviewController = require('../controllers/review.js');

// Store the review in both listing. reviews array and Review model
// "listings/:id/reviews"
router.post(
    "/", 
    isLogedIn, 
    validateReview, 
    wrapAsync(reviewController.postReview)
);

// Delete any review
router.delete(
    "/:reviewId",
    isLogedIn,
    isAuthor,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;