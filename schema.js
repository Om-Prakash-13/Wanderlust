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
        filterOption : Joi.string().allow("",null)
    }).required()
});

module.exports.reviewSchema = Joi.object({
    Review : Joi.object({
        comment : Joi.string().required(),
        rating : Joi.number().required().min(1).max(5)
    }).required()
});