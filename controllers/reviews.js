const Vineyard = require('../models/vineyard');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const vineyard = await Vineyard.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    vineyard.reviews.push(review);
    vineyard.images = [...vineyard.images, ...req.files.map(f => ({ url: f.path, filename: f.filename }))];
    await review.save();
    await vineyard.save();
    req.flash('success', 'Successfully created a new review.');
    res.redirect(`/vineyards/${vineyard._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id,reviewId } = req.params;
    await Vineyard.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted your review.');
    res.redirect(`/vineyards/${id}`);
}