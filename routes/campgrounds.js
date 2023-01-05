const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        // populate each review's author
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'); // populate campground's author
    if (!campground) {
        req.flash('error', 'cannot find that campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}))

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'cannot find that campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {

    const { id } = req.params;

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated a campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground!');
    res.redirect('/campgrounds')
}))

module.exports = router;
