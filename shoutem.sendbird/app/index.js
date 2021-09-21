import { NotificationHandlers } from 'shoutem.firebase';
import { screens } from './extension.js';
import './navigation';
import { reducer, middleware, actions, selectors, handlers } from './redux';
import enTranslations from './translations/en.json';
import { ext } from './const';
import { handleNotificationReceivedBackground } from './app';

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

NotificationHandlers.registerNotificationReceivedHandlers({
  owner: ext(),
  notificationHandlers: {
    onNotificationReceivedBackground: notification =>
      handleNotificationReceivedBackground(notification),
  },
});
