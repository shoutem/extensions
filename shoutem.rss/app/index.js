import enTranslations from './translations/en.json';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { ext } from './const';
export { loadFeed, default as rssFeed } from './redux';
export { RssListScreen } from './screens/RssListScreen';
export { buildFeedUrl } from './shared/buildFeedUrl';
export { default as createRenderAttachment } from './shared/createRenderAttachment';
export { displayLocalNotification } from './shared/handleForegroundNotification';
export {
  getImageAttachments,
  getLeadAttachment,
  getLeadImageUrl,
  isLeadAttachment,
} from './shared/resourceSelectors';
