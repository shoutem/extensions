import showdown from 'showdown';

const converter = new showdown.Converter({
  simplifiedAutoLink: true,
  excludeTrailingPunctuationFromURLs: true,
});

export function convertToHtml(text) {
  return converter.makeHtml(text);
}
