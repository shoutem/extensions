import './navigation';
import enTranslations from './translations/en.json';

export { appDidMount } from './app';
export * from './extension';
export { reducer, selectors } from './redux';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};
