// app.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

// Set up EJS for templating
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Import scraper function
const { scrapeTheVerge } = require('./scraper.js');

app.get('/', async (req, res) => {
    try {
        const articles = await scrapeTheVerge();
        res.render('index', { articles });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching articles');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});