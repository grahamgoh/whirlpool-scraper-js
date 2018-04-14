const cheerio = require('cheerio');

function scrapePosts(html) {
  const $ = cheerio.load(html);
  const threadTitle = $('#upperbar .breadcrumb li')
    .last()
    .text()
    .trim();

  const posts = $('#innerpage #content #replies #replylist > div')
    .map((i, e) => {
      const username = $(e).data('uname');
      const postId = $(e).data('replyid');

      const shortCode = $(e)
        .find('.tools .shortcode')
        .text();

      const hasEdited = $(e)
        .find('.replytools-inner .date div')
        .hasClass('edited');

      const editedDate = $(e)
        .find('.replytools-inner .date .edited')
        .text();

      const postedDate = $(e)
        .find('.replytools-inner .date')
        .text()
        .split('\n')[2]
        .trim();

      const isOp = $(e)
        .find('.replytext div')
        .hasClass('op');

      const bodyText = extractBodyText($, e);

      return {
        username,
        postId,
        shortCode,
        hasEdited,
        editedDate,
        postedDate,
        isOp,
        bodyText
      };
    })
    .get();

  const numberOfPages = $('#top_pagination > li:nth-last-child(2)')
    .text()
    .trim();

  const noteBar = $(' #top_notebar_public')
    .html()
    .trim();
  return { threadTitle, noteBar, numberOfPages, posts };
}

function extractBodyText($, e) {
  return $(e)
    .find('.replytext.bodytext p')
    .map((i2, e2) => {
      const quotedText = $(e2)
        .find('span.wcrep1')
        .text();
      if ($(e2).hasClass('reference')) {
        const refUser = $(e2).text();
        return { refUser };
      } else if (quotedText) {
        return { quotedText };
      } else {
        return { paragraph: $(e2).html() };
      }
    })
    .get();
}

module.exports = scrapePosts;
