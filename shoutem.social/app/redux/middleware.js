import { priorities, setPriority, before } from 'shoutem-core';
import { LOGIN, LOGOUT, REGISTER, getUser } from 'shoutem.auth';
import { Firebase } from 'shoutem.firebase';
import { invalidateSocialCollections, initUserSettings } from './actions';

/**
 * This middleware is used to invalidate RIO collections as a result of some event.
 * In this case, it invalidates collections that are dependant on user, which is why
 * it is dispatched when LOGIN action occurs (LOGIN action is dispatched only after
 * a successful login).
 */
export const collectionStatusMiddleware = store => next => action => {
  if (action.type === LOGIN) {
    const { dispatch } = store;

    dispatch(invalidateSocialCollections());
  }

  return next(action);
};

export const authChangeMiddleware = setPriority(
  store => next => action => {
    const state = store.getState();
    const user = getUser(state);

    if (action.type === LOGOUT) {
      const firebaseTopic = `user.${user.legacyId}`;

      Firebase.unsubscribeFromTopic(firebaseTopic);
    }

    if (action.type === LOGIN || action.type === REGISTER) {
      const firebaseTopic = `user.${user.legacyId}`;

      Firebase.subscribeToTopic(firebaseTopic);
      store.dispatch(initUserSettings(user.legacyId));
    }

    return next(action);
  },
  before(priorities.AUTH),
);
