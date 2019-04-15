import _ from 'lodash';
import { REHYDRATE } from 'redux-persist/constants';

/**
 * Prevent rehydration of object type state.
 * @param reducer
 * @returns {Function}
 */
export function preventStateRehydration(reducer) {
  return function (state, action) {
    if (action.type === REHYDRATE) {
      if (!_.isPlainObject(state)) {
        throw Error(
          `Preventing rehyidration of invalid state. State must be object, got ${typeof state}`
        );
      }
      // Prevent rehydration. New reference must be returned to prevent it.
      return { ...reducer(state, action) };
    }
    return reducer(state, action);
  }
}
