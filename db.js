const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://vivekydv:vivekCluster0@cluster0.csr861r.mongodb.net/campHive?retryWrites=true&w=majority';

const connectToMongo = () => {
    mongoose.set('strictQuery', false);
    mongoose.connect(mongoURI).then((res) => {
        console.log("Connected to mongoDB sucessfully :)");
    }).catch((err) => {
        console.log("Error in connecting to mongoDB", err);
    });
}

module.exports = connectToMongo;