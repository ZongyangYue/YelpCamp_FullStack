const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities')

mongoose.connect('mongodb://localhost:27017/yelp-camp');
// , {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// }

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Databse connected");
});

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`
        })
        await camp.save();
    }
}

seedDB();