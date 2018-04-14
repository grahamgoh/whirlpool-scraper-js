const scrapeNews = require('./scrapers/newsScraper');
const scrapeForums = require('./scrapers/forumScraper');
const scrapeThreads = require('./scrapers/threadScraper');
const scrapePosts = require('./scrapers/postsScraper');
const { newsUrl, forumUrl, threadUrl, postUrl } = require('./constants');
const axios = require('axios');

async function getNews() {
  const response = await axios.get(newsUrl);
  scrapeNews(response.data);
}

async function getForums() {
  const response = await axios.get(forumUrl);
  return scrapeForums(response.data);
}

async function getThreads(forumId) {
  const response = await axios.get(`${threadUrl}${forumId}`);
  return scrapeThreads(response.data);
}

async function getPosts(threadId) {
  const response = await axios.get(`${postUrl}${threadId}`);
  return scrapePosts(response.data);
}

// scrapeForums().then(r => console.log(r));
// scrapeThreads(92).then(r => console.log(r));
getPosts(2483257); //.then(r => console.log(r));

module.exports = { getNews, getForums, getThreads, getPosts };
