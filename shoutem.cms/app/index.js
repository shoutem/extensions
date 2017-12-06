export { CmsListScreen } from './screens/CmsListScreen';

import currentLocation from './components/CurrentLocation';
export { currentLocation };

import reducer from './redux';
export { reducer };

import enTranslations from './translations/en.json';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export {
  CATEGORIES_SCHEMA,
  IMAGE_ATTACHMENTS_SCHEMA,
  VIDEO_ATTACHMENTS_SCHEMA,
  cmsCollection,
  childCategories,
  getCategories,
} from './redux';

export { appDidMount } from './app';
