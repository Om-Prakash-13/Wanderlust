const Reviews = require('../models/review.js');
const Listings = require('../models/listing');

module.exports.postReview = async (req,res) => {
    let { id } = req.params;
    let { Review } = req.body;
    let listing = await Listings.findById(id);
    let newReview = new Reviews(Review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save(); 
    await listing.save();

    req.flash("success", "Review Added Sucessfully.");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async(req,res) => {
    let {id, reviewId} = req.params;
    await Listings.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Sucessfully.");
    res.redirect(`/listings/${id}`);
}