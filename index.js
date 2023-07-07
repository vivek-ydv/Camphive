if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const connectToMongo = require('./db');
const session = require('cookie-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Campground = require('./models/campground');

const { isLoggedIn } = require('./middlware');
// Importing routes
const userRoutes = require('./routes/user')
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

// Connecting to MongoDB
connectToMongo();

// Creating express app
const app = express();

// Configuring view engine and views directory
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing request body and method overriding
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Configuring static files
app.use(express.static(path.join(__dirname, 'public')));

// Configuring session
const sessionConfig = {
    secret: process.env.SECRET || "$ecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

// Configuring flash
app.use(flash());

// Configuring passport tool - user authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user; // From passport authentication tool
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// ------------------ Home page route
app.get('/', catchAsync(async (req, res) => {
    res.render('home');
}));

// ------------------ User Auth routes
app.use('/', userRoutes);

// ------------------ Campground routes
app.use('/campgrounds', campgroundRoutes);

// ------------------ Review routes
app.use('/campgrounds/:id/reviews', reviewRoutes);

// ------------------ Search query route
app.get('/results', async (req, res) => {
    const { search_query } = req.query
    const campgrounds = await Campground.find({ title: { $regex: search_query, $options: "i" } })
    res.render('search.ejs', { campgrounds, search_query })
})

// ------------------ User Profile route
app.get('/profile/:uname', isLoggedIn, async (req, res) => {
    // Find the user's campgrounds using the author field and populate the reviews
    const campgrounds = await Campground.find({ author: req.user._id });
    const user = req.user;
    res.render('profile.ejs', { campgrounds, user });
});


// ------------------ Handling all non-existing routes & errors
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('error', { err });
});

// Starting the server
app.listen(3000, () => {
    console.log(`Listening on port http://localhost:3000`);
});

module.exports = app;