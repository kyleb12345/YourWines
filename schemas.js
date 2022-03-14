const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.vineyardSchema = Joi.object({
    vineyard: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.string().required(),
        description: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        style: Joi.string().required(),
        category: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML(),
        price: Joi.string().required(),
        style: Joi.string().required(),
        category: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});