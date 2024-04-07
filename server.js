const express = require('express')
const axios = require('axios');
const connectDB = require('./db/connect');
const Schema = require('./model/weather');
const port = process.env.port || 3000;

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

// Middleware to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Routes

app.get('/', async (req, res) => {

    try {
        const weather = await Schema.find().sort({createdAt:-1}).limit(5);

        res.render('index', { weather :weather});

    } catch (error) {
        console.error('Error fetching recent weather searches:', error.message);

        res.render('index', { weather: [] });

    }
});



app.post('/weather', async (req, res) => {

    const { cityName } = req.body;
    const apiKey = process.env.API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    try {
        const response = await axios.get(url);

        const temperature = response.data.main.temp;

        const condition = response.data.weather[0].description;

        let weather = new Schema({

            cityName: cityName,
            temperature: temperature,
            condition: condition,
            createdAt: Date.now()
        });

        await weather.save();

        res.redirect('/');

    } catch (error) {
        res.status(404).json({ msg: `Not Found` });
    }
});


// connecting the database

const start = async () => {

    try {
        await connectDB(process.env.MONGO_URI);

        console.log("Database Connected");
        app.listen(port, () => {
            console.log(`server is running on http://localhost:${port}`);
        });

    } catch (error) {
        console.log(error);
    }
};

start();


