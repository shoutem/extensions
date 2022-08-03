import { NotificationHandlers } from 'shoutem.firebase';
import './navigation';
import enTranslations from './translations/en.json';
import { handleNotificationReceivedBackground } from './app';
import { ext } from './const';
import { screens } from './extension.js';
import { actions, handlers, middleware, reducer, selectors } from './redux';

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

NotificationHandlers.registerNotificationReceivedHandlers({
  owner: ext(),
  notificationHandlers: {
    onNotificationReceivedBackground: notification =>
      handleNotificationReceivedBackground(notification),
  },
});
