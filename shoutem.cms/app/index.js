import enTranslations from './translations/en.json';
import { changeLocaleMiddleware } from './redux';

export {
  Header as CmsHeader,
  UNIVERSAL_LINK_BUTTON_TYPE,
  UNIVERSAL_LINK_TYPE,
  UniversalLinkButton,
} from './components';
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
export { getMapUrl } from './services';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export const middleware = [changeLocaleMiddleware];

export { appDidMount } from './app';
