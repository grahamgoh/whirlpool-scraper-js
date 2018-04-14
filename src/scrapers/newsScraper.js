const cheerio = require('cheerio');
const { zip, flatten } = require('../utils');

async function scrapeNews(html) {
  const $ = cheerio.load(html);
  return $('.article.roundup.index')
    .map((i, el) => {
      const date = extractNewsDate($, el);
      const groupTitle = extractNewsGroupTitle($, el);
      const newsTitleLinkPublisher = extractTitleLinkPublisher($, el);
      const newsBlurb = extractNewsBlurb($, el);
      const newsData = zip(newsTitleLinkPublisher, newsBlurb);
      const flattenNewsData = flatten(newsData);
      return { date, groupTitle, newsItem: flattenNewsData };
    })
    .get();
}

function extractTitleLinkPublisher($, el) {
  return $(el)
    .find('h4')
    .map((_, element) => {
      const aTag = $(element).find('a');
      const title = aTag.text();
      const link = aTag.attr('href');

      const publisher = $(element)
        .find('.publisher')
        .text();

      return { title, link, publisher };
    })
    .get();
}

function extractNewsDate($, el) {
  return $(el)
    .find('h3')
    .text();
}

function extractNewsGroupTitle($, el) {
  return $(el)
    .find('h1')
    .text();
}

function extractNewsBlurb($, el) {
  return $(el)
    .find('p')
    .map((_, element) => {
      return { blurb: $(element).text() };
    })
    .get();
}

module.exports = scrapeNews;
