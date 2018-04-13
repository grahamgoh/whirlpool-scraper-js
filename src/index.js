// const scrapeNews = require('.scrapers/newsScraper');
const scrapeForums = require('./scrapers/forumScraper');

scrapeForums().then(r => console.log(r));
