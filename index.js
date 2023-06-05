const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const connectToMongo = require('./db');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');

// Importing routes
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

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

// ------------------ Configuring static files
app.use(express.static(path.join(__dirname, 'public')));

// ------------------ Home page route
app.get('/', catchAsync(async (req, res) => {
    res.render('home');
}));

// ------------------ Campground routes
app.use('/campgrounds', campgrounds);

// ------------------ Review routes
app.use('/campgrounds/:id/reviews', reviews);

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
    console.log('Listening on port 3000');
});
