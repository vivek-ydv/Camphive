const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middlware');
// Multer is used to store / handle the file data(i.e. to handle multipart/form-data in html) : npm i multer
const multer = require('multer');
const {cloudinary, storage } = require('../cloudinary/index')
const upload = multer({ storage })  //where to save to image
// Map box GeoCoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxtoken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxtoken })

//-------------------Get all campgrounds
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

//-------------------Create a new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(async (req, res, next) => {
    const geodata = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geodata.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id; // id of current logged in user 
    await campground.save();
    req.flash('success', 'Sucessfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`)
}))

//-------------------Get info about a single campground
router.get('/:id', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (campground === null) {
        req.flash('error', 'Campground does not exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))

//-------------------Edit a campground info
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Sucessfully edited the campground');
    res.redirect(`/campgrounds/${campground._id}`)
}))

//-------------------Delete a campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted the campground');
    res.redirect('/campgrounds');
}))

module.exports = router;