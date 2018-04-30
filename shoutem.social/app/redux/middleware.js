import { LOGIN } from 'shoutem.auth';
import { invalidateSocialCollections } from './actions';

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
