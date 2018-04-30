// Reference for app/index.js can be found here:
// http://shoutem.github.io/docs/extensions/reference/extension-exports

import * as extension from './extension.js';
import reducer, { collectionStatusMiddleware } from './redux';
import enTranslations from './translations/en.json';

export const screens = extension.screens;
export const themes = extension.themes;

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export const middleware = [
  collectionStatusMiddleware,
];

export { appDidMount } from './app';

export { reducer };
