const cheerio = require('cheerio');
const axios = require('axios');
const { zip } = require('../utils');
const { forumUrl } = require('../constants');

function extractForumGroupTitle($, e) {
  return $(e)
    .find('h3')
    .map((i2, e2) => $(e2).text())
    .get();
}

function extractSubForums($, e) {
  return $(e)
    .find('table')
    .map((i2, e2) => {
      return $(e2)
        .find('.title a')
        .map((i3, e3) => {
          const forumLink = $(e3).attr('href');
          const forumTitle = $(e3).text();

          return { forumLink, forumTitle };
        });
    })
    .get();
}

async function scrapeForums() {
  const response = await axios.get(forumUrl);
  const $ = cheerio.load(response.data);
  const results = $('.column', '#forumindex')
    .map((i, e) => {
      const forumGroupTitle = extractForumGroupTitle($, e);
      const subForums = extractSubForums($, e);
      const mappedSubForums = subForums.map(i => i.get());
      const results = zip(forumGroupTitle, mappedSubForums);
      return results.map(x => ({ forumGroup: x[0], forums: x[1] }));
    })
    .get();

  return results;
}

module.exports = scrapeForums;
