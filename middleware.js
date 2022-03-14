const { vineyardSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Vineyard = require('./models/vineyard');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be authorized.');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateVineyard = (req, res, next) => {
    const { error } = vineyardSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const vineyard = await Vineyard.findById(id);
    if (!vineyard.author.equals(req.user._id)) {
        req.flash('error', 'Sorry, you cannot do that.');
        return res.redirect(`/vineyards/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Sorry, you cannot do that.');
        return res.redirect(`/vineyards/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}