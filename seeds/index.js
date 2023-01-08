const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

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

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: "63b64d8c79816f8933aa09b9",
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia, enim consequatur quae tenetur adipisci placeat perspiciatis reprehenderit esse rerum at? Quia quo, cumque cupiditate ipsum nemo consequatur nostrum quos libero?",
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/yzy/image/upload/v1673141927/YelpCamp/zaf708ip8wq9llbvqyh5.jpg',
                    filename: 'YelpCamp/zaf708ip8wq9llbvqyh5',
                },
                {
                    url: 'https://res.cloudinary.com/yzy/image/upload/v1673141927/YelpCamp/yirra2aciwqjrw1zhhi7.jpg',
                    filename: 'YelpCamp/yirra2aciwqjrw1zhhi7',
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
