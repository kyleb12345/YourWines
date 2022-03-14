const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Vineyard = require('../models/vineyard');

mongoose.connect('mongodb://localhost:27017/vineyard-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database is running");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Vineyard.deleteMany({});
    for(let i = 0; i < 15; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const vine = new Vineyard({
            //BARTADMIN USER ID NUMBER IN MONGO
            author: '61ea4c2e11e56883896e90bd',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: '$$$',
            geometry: {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus quam, dolore distinctio impedit ipsam culpa excepturi maiores veritatis tempore tempora repudiandae aliquid corporis exercitationem incidunt eum voluptas minima placeat quisquam.',
            images: [
                
                {
                    url: 'https://res.cloudinary.com/dlgtx9os2/image/upload/v1643174705/VineyardCamp/jdwszi1ady4iiixuembf.jpg',    
                filename: 'VineyardCamp/jdwszi1ady4iiixuembf'
                
                
                },
                {
                url: 'https://res.cloudinary.com/dlgtx9os2/image/upload/v1643174704/VineyardCamp/vucx7rttteft2pgvctgj.jpg',    
                filename: 'VineyardCamp/vucx7rttteft2pgvctgj'
                }
            ]
            
        })
        await vine.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})