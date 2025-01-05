const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        image : Joi.object({
            url: Joi.string().allow("",null)
        }),
        country : Joi.string().required(),
        location : Joi.string().required(),
        price : Joi.number().min(0),
        filterOption : Joi.string().allow("",null),
        guestCapacity : Joi.number().required().min(1)
    }).required()
});

module.exports.reviewSchema = Joi.object({
    Review : Joi.object({
        comment : Joi.string().required(),
        rating : Joi.number().required().min(1).max(5)
    }).required()
});

module.exports.reservationSchema = Joi.object({
    checkin: Joi.date().required().greater('now').messages({
        "date.greater": "Check-in date must be in the future.",
        "any.required": "Check-in date is required."
    }),
    checkout: Joi.date().required().greater(Joi.ref('checkin')).messages({
        "date.greater": "Check-out date must be after the check-in date.",
        "any.required": "Check-out date is required."
    }),
    guests: Joi.number().required().min(1).messages({
        "number.base": "Guest number must be a number.",
        "number.min": "Guest number must be at least 1.",
        "any.required": "Guest number is required."
    }),
    status: Joi.string().valid("confirmed", "pending", "cancelled").default("pending").messages({
        "any.only": "Status must be one of 'confirmed', 'pending', or 'cancelled'."
    })
});