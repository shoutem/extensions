import enTranslations from './translations/en.json';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { ext } from './const';
export { rssFeed } from './redux';
export { buildFeedUrl, buildFeedUrlWithEndpoint } from './shared/buildFeedUrl';
export {
  getLeadAttachment,
  getLeadImageUrl,
  getImageAttachments,
  isLeadAttachment,
} from './shared/resourceSelectors';
export { default as createRenderAttachment } from './shared/createRenderAttachment';
export { RssListScreen } from './screens/RssListScreen';
export { displayLocalNotification } from './shared/handleForegroundNotification';
