const Joi = require("joi"); // package to validate schema

// schema validators

// this line is exporting an object with a property named 'listingSchema'
// listing schema validate
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.object(),
        price: Joi.number().required().min(0), // min 0
        location: Joi.string().required(),
        country: Joi.string().required(),
        geometry: Joi.object({
            type: Joi.string().valid("Point").required(),
            coordinates: Joi.array().items(Joi.number()).length(2).required(),
        })
    }).required(),
});

// review schema validate
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});