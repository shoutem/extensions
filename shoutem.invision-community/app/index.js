import enTranslations from './translations/en.json';

export * from './extension';

export { appDidMount } from './app';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};
