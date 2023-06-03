const mongoose = require('mongoose');
const connectToMongo = require('../db');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

connectToMongo();
const sample = array => array[Math.floor(Math.random() * array.length)];
const images = [
    'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636239/YelpCamp/mt7vew46iuelyjperm02.jpg',
    'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636244/YelpCamp/trvehxjujs8frbrjrfil.jpg',
    'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636247/YelpCamp/amniou07rihgxtsagsca.jpg',
    'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636248/YelpCamp/t5xqmk2ijt0o0shdbkkh.jpg',
    'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636469/YelpCamp/qry2l5ntcxmpstungx9q.jpg',
    'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636471/YelpCamp/kan7ktxqgynjudblesv8.jpg',
    'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636474/YelpCamp/y5xf7zdzgn5vi444qpsx.jpg',
    'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636476/YelpCamp/qmmxwz5prukysbohozaz.jpg'

]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random8 = Math.floor(Math.random() * 8);
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: images[random8],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias modi libero exercitationem excepturi nobis recusandae assumenda consequatur fugit omnis, nihil voluptates dolore, provident sequi minus sint iusto. Esse, asperiores velit.',
            price: price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})