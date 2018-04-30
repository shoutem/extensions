// Constants `screens` (from extension.js) and `reducer` (from index.js)
// are exported via named export
// It is important to use those exact names

import enTranslations from './translations/en.json';

export * from './app';
export * from './extension';
export * from './middleware';
export * from './redux';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};
