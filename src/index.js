// const scrapeNews = require('.scrapers/newsScraper');
// const scrapeForums = require('./scrapers/forumScraper');
const scrapeThreads = require('./scrapers/threadScraper');

// scrapeForums().then(r => console.log(r));
scrapeThreads(114).then(r => console.log(r));
