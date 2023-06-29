const mongoose = require('mongoose');
const connectToMongo = require('../db');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
// MapBox GeoCoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxtoken = 'pk.eyJ1Ijoidml2ZWt5ZHYiLCJhIjoiY2xqZzUxcmY0MDhuNTNldGc2MGlyMnRydCJ9.7hcKoPOcsU8lFn-BAwFumg'
const geocoder = mbxGeocoding({ accessToken: mapBoxtoken })

connectToMongo();
const sample = array => array[Math.floor(Math.random() * array.length)];

const images = [
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636239/YelpCamp/mt7vew46iuelyjperm02.jpg',
        filename: 'YelpCamp/mt7vew46iuelyjperm02',
    },
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636244/YelpCamp/trvehxjujs8frbrjrfil.jpg',
        filename: 'YelpCamp/trvehxjujs8frbrjrfil',
    },
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636247/YelpCamp/amniou07rihgxtsagsca.jpg',
        filename: 'YelpCamp/amniou07rihgxtsagsca',
    },
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636248/YelpCamp/t5xqmk2ijt0o0shdbkkh.jpg',
        filename: 'YelpCamp/t5xqmk2ijt0o0shdbkkh',
    },
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636469/YelpCamp/qry2l5ntcxmpstungx9q.jpg',
        filename: 'YelpCamp/qry2l5ntcxmpstungx9q',
    },
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636471/YelpCamp/kan7ktxqgynjudblesv8.jpg',
        filename: 'YelpCamp/kan7ktxqgynjudblesv8',
    },
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636474/YelpCamp/y5xf7zdzgn5vi444qpsx.jpg',
        filename: 'YelpCamp/y5xf7zdzgn5vi444qpsx',
    },
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636476/YelpCamp/qmmxwz5prukysbohozaz.jpg',
        filename: 'YelpCamp/qmmxwz5prukysbohozaz',
    },
    {
        url: 'https://res.cloudinary.com/dayiolmuz/image/upload/v1687897480/Camphive/nc1jzjpvpyhwhuoybpjn.jpg',
        filename: 'YelpCamp/y5xf7zdzgn5vi444qpsx',
    },
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636474/YelpCamp/y5xf7zdzgn5vi444qpsx.jpg',
        filename: 'YelpCamp/y5xf7zdzgn5vi444qpsx',
    },
]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random400 = Math.floor(Math.random() * 400);
        const random8 = Math.floor(Math.random() * 8);
        const price = Math.floor(Math.random() * 20) + 10;
        const location = `${cities[random400].city}, ${cities[random400].admin_name}`
        const geodata = await geocoder.forwardGeocode({
            query: location,
            limit: 1
        }).send()

        const camp = new Campground({
            author: '648042f83174b1e1a83df3e9',
            location: location,
            geometry: geodata.body.features[0].geometry,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [images[random8],images[random8+1],images[random8+2]],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias modi libero exercitationem excepturi nobis recusandae assumenda consequatur fugit omnis, nihil voluptates dolore, provident sequi minus sint iusto. Esse, asperiores velit.',
            price: price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})