// Reference for app/index.js can be found here:
// http://shoutem.github.io/docs/extensions/reference/extension-exports

import './navigation';
import enTranslations from './translations/en.json';
import * as extension from './extension.js';
import reducer, {
  actions,
  authChangeMiddleware,
  collectionStatusMiddleware,
  selectors,
} from './redux';

export const { screens } = extension;
export const { themes } = extension;

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export const middleware = [collectionStatusMiddleware, authChangeMiddleware];

export { appDidFinishLaunching, appDidMount } from './app';

export { actions, reducer, selectors };
