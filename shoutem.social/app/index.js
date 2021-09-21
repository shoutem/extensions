// Reference for app/index.js can be found here:
// http://shoutem.github.io/docs/extensions/reference/extension-exports

import * as extension from './extension.js';
import reducer, {
  collectionStatusMiddleware,
  authChangeMiddleware,
  selectors,
  actions,
} from './redux';
import enTranslations from './translations/en.json';
import './navigation';

export const screens = extension.screens;
export const themes = extension.themes;

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export const middleware = [collectionStatusMiddleware, authChangeMiddleware];

export { appDidMount, appDidFinishLaunching } from './app';

export { reducer, selectors, actions };
