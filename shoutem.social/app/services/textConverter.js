import showdown from 'showdown';

const handleHashtags = {
  type: 'lang',
  filter(text) {
    // Converter parses # to headings. Replace # with unicode to prevent that.
    // Then, style hashtag with blue text color for better hashtag UI.
    return text
      .replace(/#/g, '&#35;')
      .replace(/&#35;(\w+)/g, '<span style="color: #0000EE;">&#35;$1</span>');
  },
};

const converter = new showdown.Converter({
  simplifiedAutoLink: true,
  excludeTrailingPunctuationFromURLs: true,
  extensions: [handleHashtags],
});

export function convertToHtml(text) {
  return converter.makeHtml(text);
}
