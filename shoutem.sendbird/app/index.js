import './navigation';
import enTranslations from './translations/en.json';
import { screens } from './extension.js';
import { registerBackgroundMessageHandler } from './notificationHandlers.js';
import { actions, handlers, middleware, reducer, selectors } from './redux';

registerBackgroundMessageHandler();

export const shoutem = {
  i18n: {
    translations: { en: enTranslations },
  },
};

export { appDidFinishLaunching, appWillMount, appWillUnmount } from './app';

export { actions, handlers, middleware, reducer, screens, selectors };

export * from './components';
export * from './const';
export { SendBird } from './services';
