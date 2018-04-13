const cheerio = require('cheerio');
const axios = require('axios');
const { threadUrl } = require('../constants');

function extractThreadStatus($, e) {
  const isSticky = $(e).hasClass('sticky');
  const isClosed = $(e).hasClass('closed');
  const isRecent = $(e).hasClass('recent');

  return { isSticky, isClosed, isRecent };
}

function extractThreadGroupInfo($, e) {
  const title =
    $(e)
      .find('.title .group')
      .text() || 'No groups';

  const groupUrl = $(e)
    .find('.title .group')
    .attr('href');

  return { title, groupUrl };
}

function extractAuthorInfo($, e) {
  const oldestElement = $(e).find('.oldest a');
  const authorName = oldestElement.text();
  const authorUrl = oldestElement.attr('href');
  const authoredDate = $(e)
    .find('.oldest')
    .contents()
    .last()
    .text();

  return { authorName, authorUrl, authoredDate };
}

function extractLatestPostedUserInfo($, e) {
  const newestElement = $(e).find('.newest span a');
  const lastPostedUserName = newestElement.text();
  const lastPostedUserUrl = newestElement.attr('href');
  const lastPostedDate = $(e)
    .find('.newest span')
    .contents()
    .last()
    .text();

  return { lastPostedUserName, lastPostedUserUrl, lastPostedDate };
}

function extractPages($, e) {
  const pages = $(e)
    .find('td.title script')
    .html();

  return pages ? pages.split(',')[1].replace(');', '') : '1';
}
function extractThreadGroups($) {
  return $('#threads thead select option', '#content')
    .slice(1)
    .map((i, e) => {
      const title = $(e)
        .text()
        .trim();
      const id = $(e).attr('value');
      return { title, id };
    })
    .get();
}
async function scrapeThreads(forumId) {
  const response = await axios.get(`${threadUrl}${forumId}`);
  const $ = cheerio.load(response.data);
  const threads = $('#threads tbody tr', '#content')
    .map((i, e) => {
      const threadStatus = extractThreadStatus($, e);

      const aTag = $(e).find('a.title');
      const threadTitle = aTag.text();
      const threadUrl = aTag.attr('href');

      const numberOfReplies = $(e)
        .find('.reps')
        .text();

      const numberOfSeens = $(e)
        .find('.reads')
        .text();

      const authorInfo = extractAuthorInfo($, e);
      const lastPostedUserInfo = extractLatestPostedUserInfo($, e);
      const threadGroup = extractThreadGroupInfo($, e);
      const numberOfPagesInThread = extractPages($, e);
      return {
        threadStatus,
        threadTitle,
        threadUrl,
        numberOfReplies,
        numberOfSeens,
        authorInfo,
        lastPostedUserInfo,
        threadGroup,
        numberOfPagesInThread
      };
    })
    .get();

  const threadGroups = extractThreadGroups($);
  const numberOfPagesInForum = $('.footbar .pagination option')
    .last()
    .text();

  const forumTitle = $('#upperbar .breadcrumb span[itemprop="name"]')
    .last()
    .text();

  return { forumTitle, numberOfPagesInForum, threadGroups, threads };
}

module.exports = scrapeThreads;
