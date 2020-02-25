const UNICODE_SYMBOLS = {
  '&#8211;': '–',
  '&#8212;': '-',
  '&#8216;': '\'',
  '&#8217;': '\'',
  '&#8218;': '‚',
  '&#8220;': '"',
  '&#8221;': '"',
  '&#8230;': '…',
  '&#032;': ' ',
  '&#033;': '!',
  '&#034;': '"',
  '&#035;': '#',
  '&#036;': '$',
  '&#037;': '%',
  '&#038;': '&',
  '&#039;': '\'',
  '&amp;': '&',
};
const UNICODE_REGEX = new RegExp(Object.keys(UNICODE_SYMBOLS).join('|'), 'gi');

export default function resolveArticleTitle(title) {
  return title.replace(UNICODE_REGEX, matched => UNICODE_SYMBOLS[matched]);
}
