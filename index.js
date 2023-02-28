const express = require('express');
const path = require('path');
const connectToMongo = require('./db');
const Campground = require('./models/campground');

connectToMongo();
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/createcampground', async (req, res) => {
    const camp = new Campground({ title: 'My firstCamp', price: '$10' });
    await camp.save();
    res.send(camp);
})

app.listen(3000, () => {
    console.log('On port 3000');
})