import { Linking } from 'react-native';
import { priorities, setPriority } from '@shoutem/core/middlewareUtils';

import { OPEN_EXTERNAL_BROWSER } from './redux';

const openBrowserScreen = store => next => action => {
  if (action.type === OPEN_EXTERNAL_BROWSER) {
    return Linking.openURL(action.url);
  }

  return next(action);
};
setPriority(openBrowserScreen, priorities.NAVIGATION);

export {
  openBrowserScreen,
};
