import { Alert, Linking } from 'react-native';
import { I18n } from 'shoutem.i18n';
import { priorities, setPriority } from 'shoutem-core';
import { ext } from './const';
import { getUser, OPEN_EXTERNAL_BROWSER } from './redux';
import { parseUrl } from './services';

const openWebViewScreen = store => next => action => {
  if (action.type === OPEN_EXTERNAL_BROWSER) {
    const { url } = action;

    const state = store.getState();
    const ownUser = getUser(state);

    const resolvedUrl = parseUrl(url, ownUser);

    return url
      ? Linking.openURL(resolvedUrl)
      : Alert.alert(
          I18n.t(ext('noUrlErrorTitle')),
          I18n.t(ext('noUrlErrorMessage')),
        );
  }

  return next(action);
};
setPriority(openWebViewScreen, priorities.NAVIGATION);

export { openWebViewScreen };
