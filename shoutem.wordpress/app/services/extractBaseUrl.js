export default function extractBaseUrl(feedUrl) {
  return feedUrl.includes('/category/')
    ? feedUrl.substr(0, feedUrl.indexOf('/category/'))
    : feedUrl;
}
