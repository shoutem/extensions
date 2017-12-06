import { Alert, Linking } from 'react-native';
import { priorities, setPriority } from '@shoutem/core/middlewareUtils';

import { I18n } from 'shoutem.i18n';

import { OPEN_EXTERNAL_BROWSER } from './redux';
import { ext } from './const';

const openWebViewScreen = store => next => action => {
  if (action.type === OPEN_EXTERNAL_BROWSER) {
    const { url } = action;

    return url ? Linking.openURL(url) : Alert.alert(I18n.t(ext('noUrlErrorTitle')), I18n.t(ext('noUrlErrorMessage')));
  }

  return next(action);
};
setPriority(openWebViewScreen, priorities.NAVIGATION);

export {
  openWebViewScreen,
};
