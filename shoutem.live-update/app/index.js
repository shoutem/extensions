import enTranslations from './translations/en.json';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { appDidMount, appWillUnmount } from './app.js';
export { reducer } from './redux';
