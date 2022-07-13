import { TARGET_VALUES } from '../const';

const ACTION_TYPES = {
  URL: 'shoutem.navigation.OPEN_MODAL',
  SCREEN: 'shoutem.application.EXECUTE_SHORTCUT',
};

export function getNotificationAction(notification) {
  if (notification.target === TARGET_VALUES.URL) {
    const action = {
      route: {
        key: `push-${new Date().getTime().toString()}`,
        screen: 'shoutem.web-view.WebViewScreen',
        props: {
          url: notification.contentUrl,
          title: notification.title,
          showNavigationToolbar: true,
        },
      },
      type: ACTION_TYPES.URL,
    };

    return JSON.stringify(action);
  }

  if (notification.target === TARGET_VALUES.SCREEN) {
    const action = {
      type: ACTION_TYPES.SCREEN,
      navigationAction: 'shoutem.navigation.OPEN_MODAL',
      shortcutId: notification.shortcutId,
    };

    return JSON.stringify(action);
  }

  return null;
}
