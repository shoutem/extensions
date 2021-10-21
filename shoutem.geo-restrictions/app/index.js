import './navigation';
import enTranslations from './translations/en.json';

export * from './extension';

export { reducer, selectors } from './redux';

export { appDidMount } from './app';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};
