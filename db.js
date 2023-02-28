const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/camphiveApp";

const connectToMongo = () => {
    mongoose.set('strictQuery', false);
    mongoose.connect(mongoURI).then((res) => {
        console.log("Connected to mongoDB sucessfully :)");
    }).catch((err) => {
        console.log("Error in connecting to mongoDB", err);
    });
}

module.exports = connectToMongo;