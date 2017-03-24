import { Linking } from 'react-native';
import { priorities, setPriority } from '@shoutem/core/middlewareUtils';

import { OPEN_EXTERNAL_BROWSER } from './redux';

const openWebViewScreen = store => next => action => {
  if (action.type === OPEN_EXTERNAL_BROWSER) {
    return Linking.openURL(action.url);
  }

  return next(action);
};
setPriority(openWebViewScreen, priorities.NAVIGATION);

export {
  openWebViewScreen,
};
