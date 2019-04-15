import { setPriority, priorities } from 'shoutem-core';
import { isNavigationAction } from './actions';
import { getActiveNavigationStack } from './selectors';

export const setActiveNavigationStackMiddleware = setPriority(store => next => action => {
  if (isNavigationAction(action) && !action.navigationStack) {
    // eslint-disable-next-line no-param-reassign
    action.navigationStack = getActiveNavigationStack(store.getState());
  }

  return next(action);
}, priorities.NAVIGATION);
