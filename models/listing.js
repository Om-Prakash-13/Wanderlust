const mongoose = require('mongoose');
const Review = require('./review');

let imgString = "https://media.istockphoto.com/id/1348015504/photo/two-cozy-ecological-wooden-houses-in-the-woods.jpg?s=612x612&w=0&k=20&c=_ld2k1nDxEGC59g-raMGI-r5aBKAVJlAF4lwhC8KRJM=";

const listingSchema = new mongoose.Schema({
    title:{
        type: String,
        required : true
    },
    description:{
        type: String
    },
    image:{
        filename:{
            type : String
        },
        url : {
            type: String,
            set : (v) => (v === "" || undefined) ? imgString : v,
            default : imgString
        }
    },
    price:{
        type: Number
    },
    location:{
        type: String
    },
    geometry : {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    country:{
        type: String
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        },
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    filterOption : {
        type : String,
        enum : ['','Trending','Rooms','Iconic City','Mountains', 'Castles','Pools','Camping','Farms','Arctic','Ships']
    }
});

listingSchema.index({ geometry: '2dsphere' });

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        for(let review of listing.reviews){
            await Review.findByIdAndDelete(review);
        }
    }
})

const Listings = mongoose.model("Listing",listingSchema);
module.exports = Listings;