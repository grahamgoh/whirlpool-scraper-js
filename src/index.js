const scrapeNews = require('.scrapers/newsScraper');
const scrapeForums = require('./scrapers/forumScraper');
const scrapeThreads = require('./scrapers/threadScraper');
const { newsUrl, forumUrl, threadUrl } = require('../constants');
const axios = require('axios');

async function getNews() {
  const response = await axios.get(newsUrl);
  scrapeNews(response.data);
}

async function getForums() {
  const response = await axios.get(forumUrl);
  scrapeForums(response.data);
}

async function getThreads(forumId) {
  const response = await axios.get(`${threadUrl}${forumId}`);
  scrapeThreads(response.data);
}

// scrapeForums().then(r => console.log(r));
// scrapeThreads(92).then(r => console.log(r));

module.exports = { getNews, getForums, getThreads };
