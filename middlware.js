const { campgroundSchema, reviewSchema } = require('./joiSchemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You are not signed in :(');
    return res.redirect('/login');
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params
  // Protecting this root only the owner can edit
  const campground = await Campground.findById(id)
  if (req.user && !campground.author.equals(req.user._id)) {
    req.flash('error', `You don't have authorization to edit ${campground.title}`)
    return res.redirect(`/campgrounds/${id}`)
  }
  next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params
  // Protecting this root only the owner can edit
  const review = await Review.findById(reviewId)
  if (req.user && !review.author.equals(req.user._id)) {
      req.flash('error', `You don't have authorization to delete review`)
      return res.redirect(`/campgrounds/${id}`)
  }
  next()
}

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    // Since details is array of object
    const msg = error.details.map(el => el.message).join(', ')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    // Since details is array of object
    const msg = error.details.map(el => el.message).join(', ')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}


