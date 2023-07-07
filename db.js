const mongoose = require('mongoose');
const mongoURI = process.env.MONGOURI;

const connectToMongo = () => {
    mongoose.set('strictQuery', false);
    mongoose.connect(mongoURI).then((res) => {
        console.log("Connected to mongoDB sucessfully :)");
    }).catch((err) => {
        console.log("Error in connecting to mongoDB", err);
    });
}

module.exports = connectToMongo;