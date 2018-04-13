const scrapeNews = require('./newsScraper');

scrapeNews().then(r => console.log(r));
