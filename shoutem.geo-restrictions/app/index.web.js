import './navigation';
import enTranslations from './translations/en.json';

// Web doesn't have permission so we can't get and set user's location. All of this was done in appDidMount,
// which we're skipping here.
export * from './extension';
export { reducer, selectors } from './redux';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};
