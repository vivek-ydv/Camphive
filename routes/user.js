const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport')

//-----------Register route
router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', async (req, res, next) => {
    try {
        const { email, username, password } = req.body.user
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {    // doesnt support await , here after account creation you are directly loggged in
            if (err) {
                return next(err)
            }
            req.flash('success', `Welcome to Camphive ${user.username}!`)
            res.redirect('/campgrounds')
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/register')
    }
})

//----------Login route
router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', `Welcome back ${req.body.username}!`);
    res.redirect('/campgrounds');
});

//----------Logout route
router.get('/logout', (req, res) => {
    req.logout(err => {
        req.flash('success', 'Goodbye :(');
        res.redirect('/campgrounds');
    });
});

module.exports = router;