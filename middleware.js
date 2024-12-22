const Listings = require('./models/listing');
const ExpressError = require('./util/ExpressError.js');
const {listingSchema,reviewSchema} = require('./schema.js');
const Review = require('./models/review.js');

module.exports.isLogedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure","You must be login to create Listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    } 
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listings.findById(id);
    if(!listing.owner._id.equals(res.locals.user._id)){
        req.flash("failure", "You are not the owner.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) => {
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
    else{
        next();
    }
}

module.exports.validateReview = (req,res,next) => {
    let result = reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error);
    }else{
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    let {reviewId,id} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.user._id)){
        req.flash("failure", "You are not the author of this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}