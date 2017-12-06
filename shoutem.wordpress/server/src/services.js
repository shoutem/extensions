import validator from 'validator';
import moment from 'moment';
import Uri from 'urijs';

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
  const dateTimeDisplay = displayTimeAgo ? originalDate.from(nowDate) : dateTimeFormatted;

  return {
    dateTimeFormatted,
    dateTimeDisplay,
  };
}

function validateUrl(url) {
  return validator.isURL(url, { require_protocol: false });
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
