import { screens } from './extension.js';
import { reducer, middleware, actions, selectors, handlers } from './redux';
import enTranslations from './translations/en.json';

export const shoutem = {
  i18n: {
    translations: { en: enTranslations },
  },
};

export { appDidFinishLaunching, appWillUnmount, appWillMount } from './app';

export { reducer, middleware, screens, actions, selectors, handlers };

export { SendBird } from './services';

export * from './components';
export * from './const';
