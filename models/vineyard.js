const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const VineyardSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
    },
    coordinates: {
        type: [Number],
        required: true
        }
    },
    price: String,
    description: String,
    location: String,
    category: String,
    style: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

VineyardSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/vineyards/${this._id}">${this.title}</a></strong>
    <p>${this.category} | ${this.style}</p> `
});

// this will delete all the reviews within a deleted location site

VineyardSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Vineyard', VineyardSchema);