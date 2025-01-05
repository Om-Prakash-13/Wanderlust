const mongoose = require('mongoose');
const {Schema} = mongoose;

const reservationSchema = new Schema({
    checkin : {
        type : Date,
        required : true
    },
    checkout : {
        type : Date,
        required : true
    },
    guestNumber : {
        type : Number,
        required : true
    },
    property : {
        type : Schema.Types.ObjectId,
        ref : "Listing"
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    guest : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    status : {
        type : String,
        enum : ["confirmed", "pending", "cancelled"]
    },
    price :{
        type : Number,
        required : true
    }
});

// reservationSchema.pre('save', function (next) {
//     const duration = (this.checkout - this.checkin) / (1000 * 60 * 60 * 24); // Difference in days
//     this.price = duration * this.price; // Replace `someRate` with your pricing logic
//     next();
// });

module.exports = mongoose.model("Reservation",reservationSchema)