export { CmsListScreen } from './screens/CmsListScreen';
export { default as currentLocation } from './components/CurrentLocation';
export {
  default as reducer,
  invalidateLoadedCollections,
  CATEGORIES_SCHEMA,
  IMAGE_ATTACHMENTS_SCHEMA,
  VIDEO_ATTACHMENTS_SCHEMA,
  cmsCollection,
  childCategories,
  getCategories,
} from './redux';

import enTranslations from './translations/en.json';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { appDidMount } from './app';
