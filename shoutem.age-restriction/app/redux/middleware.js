import {
  NavigationStacks,
  SET_NAVIGATION_INITIALIZED,
} from 'shoutem.navigation';
import { after, priorities, setPriority } from 'shoutem-core';
import { VERIFICATION_STACK } from '../const';
import { getAgeVerificationCompleted } from './selectors';

export const showAgeVerificationMiddleware = setPriority(
  store => next => action => {
    if (action.type === SET_NAVIGATION_INITIALIZED) {
      const state = store.getState();

      const shouldDisplayVerification = !getAgeVerificationCompleted(state);

      if (shouldDisplayVerification) {
        return NavigationStacks.openStack(VERIFICATION_STACK, {
          onContinuePress: () => {
            NavigationStacks.closeStack(VERIFICATION_STACK);
            return next(action);
          },
        });
      }
    }

    return next(action);
  },
  after(priorities.INIT),
);
