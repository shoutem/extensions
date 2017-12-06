import enTranslations from './translations/en.json';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { rssFeed } from './redux';
export { buildFeedUrl } from './shared/buildFeedUrl';
export { getLeadAttachment, getLeadImageUrl, isLeadAttachment } from './shared/resourceSelectors';
export { default as createRenderAttachment } from './shared/createRenderAttachment';
export { RssListScreen } from './screens/RssListScreen';
