import _ from 'lodash';
import moment from 'moment';
import Uri from 'urijs';
import validator from 'validator';

const HTTPS_PROTOCOL = 'https';

const RSS_DATE_TIME_FORMAT = 'MMM DD YYYY';
moment.locale('en');

export function toLocalDateTime(dateTime) {
  const MAX_DIFFERENCE_IN_HOURS = 12;
  const date = new Date(dateTime);

  if (date.toString() === 'Invalid Date') {
    return {
      dateTimeFormatted: ' - ',
      dateTimeDisplay: ' - ',
    };
  }

  const originalDate = moment(date);
  const nowDate = moment(new Date());
  const differenceInHours = nowDate.diff(originalDate, 'hours');
  const dateTimeFormatted = originalDate.format(RSS_DATE_TIME_FORMAT);
  const displayTimeAgo = differenceInHours <= MAX_DIFFERENCE_IN_HOURS;
  const dateTimeDisplay = displayTimeAgo
    ? originalDate.from(nowDate)
    : dateTimeFormatted;

  return {
    dateTimeFormatted,
    dateTimeDisplay,
  };
}

function validateUrl(url) {
  return validator.isURL(url, { require_protocol: false });
}

export function extractBaseUrl(feedUrl) {
  return feedUrl.includes('/category/')
    ? feedUrl.substr(0, feedUrl.indexOf('/category/'))
    : feedUrl;
}

export function extractCategoriesFromUrl(feedUrl) {
  const hasCategories = feedUrl.includes('/category/');

  const categoriesString = feedUrl.slice(
    feedUrl.lastIndexOf('/category/') + 10,
  );
  const categories = categoriesString.split('/');

  return hasCategories ? categories : [];
}

export function createCategoryFilter(feedUrl, categories) {
  // 'slug' is the actual string name of the category in the URL, e.g. 'latest-news'.
  const categorySlugs = extractCategoriesFromUrl(feedUrl);

  if (!categorySlugs.length) {
    return '';
  }

  const categoryIds = [];
  _.forEach(categorySlugs, slug => {
    const category = _.find(categories, { slug }, false);

    if (category) {
      categoryIds.push(category.id);
    }
  });

  return categoryIds.length ? `?categories=${categoryIds.join(',')}` : '';
}

export function validateWordPressUrl(url) {
  return url && validateUrl(url);
}

export function isFeedUrlInsecure(feedUrl) {
  if (!feedUrl) {
    return false;
  }

  const currentProtocol = new Uri().protocol();
  if (currentProtocol !== HTTPS_PROTOCOL) {
    return false;
  }

  const feedUri = new Uri(feedUrl);
  const feedProtocol = feedUri.protocol();
  return feedProtocol !== HTTPS_PROTOCOL;
}
