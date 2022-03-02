import _ from 'lodash';
import { isAuthenticated, LOGIN_INITIALIZED } from 'shoutem.auth';
import {
  NavigationStacks,
  SET_NAVIGATION_INITIALIZED,
} from 'shoutem.navigation';
import {
  getOnboardingCompleted,
  ONBOARDING_FINISHED,
} from 'shoutem.onboarding';
import { before, priorities, setPriority } from 'shoutem-core';
import { ext, VERIFICATION_STACK } from '../const';
import {
  loadCart,
  loadInventory,
  SET_VERIFICATION_COMPLETED,
  setLoginScreenShown,
} from './actions';
import {
  getAgeVerificationCompleted,
  getInitialLoginScreenShown,
} from './selectors';

export const authenticateMiddleware = setPriority(
  store => next => action => {
    if (action.type === LOGIN_INITIALIZED) {
      const {
        payload: { loginSuccessCallback, onCancel = null, canGoBack = true },
      } = action;

      const state = store.getState();

      if (isAuthenticated(state)) {
        return next(action);
      }

      return NavigationStacks.openStack(ext(), {
        canGoBack,
        onCancel: onCancel || (() => NavigationStacks.closeStack(ext())),
        onLoginSuccess: () => {
          NavigationStacks.closeStack(ext());

          if (loginSuccessCallback) {
            loginSuccessCallback();
          }
        },
      });
    }

    if (action.type === SET_VERIFICATION_COMPLETED) {
      const state = store.getState();

      const { callback = _.noop } = action.payload;

      const shouldShowRegisterScreen = !getInitialLoginScreenShown(state);

      if (shouldShowRegisterScreen) {
        return NavigationStacks.openStack(ext(), {
          canGoBack: false,
          showSkipButton: true,
          onCancel: () => {
            store.dispatch(setLoginScreenShown());
            NavigationStacks.closeStack(ext());
            callback();
            next(action);
          },
          onLoginSuccess: () => {
            store.dispatch(setLoginScreenShown());
            NavigationStacks.closeStack(ext());
            callback();
            next(action);
          },
        });
      }

      callback();
    }

    return next(action);
  },
  before(priorities.AUTH),
);

export const restoreUserMiddleware = store => next => async action => {
  if (action.type === SET_NAVIGATION_INITIALIZED) {
    const state = store.getState();

    if (isAuthenticated(state)) {
      store.dispatch(loadCart());
      store.dispatch(loadInventory());
    }
  }

  return next(action);
};

export const showAgeVerificationMiddleware = store => next => action => {
  if (action.type === ONBOARDING_FINISHED) {
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

  if (action.type === SET_NAVIGATION_INITIALIZED) {
    const state = store.getState();

    const isOnboardingComplete = getOnboardingCompleted(state);

    const shouldDisplayVerification = !getAgeVerificationCompleted(state);

    if (isOnboardingComplete && shouldDisplayVerification) {
      return NavigationStacks.openStack(VERIFICATION_STACK, {
        onContinuePress: () => {
          NavigationStacks.closeStack(VERIFICATION_STACK);
          return next(action);
        },
      });
    }
  }

  return next(action);
};
