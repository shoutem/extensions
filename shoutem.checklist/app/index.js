import enTranslations from './translations/en.json';

export * from './extension';
export { reducer } from './redux';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};
