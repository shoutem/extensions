import enTranslations from './translations/en.json';

export { Header as CmsHeader } from './components';
export { default as currentLocation } from './components/CurrentLocation';
export {
  CATEGORIES_SCHEMA,
  childCategories,
  clearScreenState,
  cmsCollection,
  getCategories,
  getScreenState,
  IMAGE_ATTACHMENTS_SCHEMA,
  invalidateLoadedCollections,
  reducer,
  setScreenState,
  VIDEO_ATTACHMENTS_SCHEMA,
} from './redux';
export { CmsListScreen } from './screens/CmsListScreen';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { appDidMount } from './app';
