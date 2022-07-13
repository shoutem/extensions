import { Alert } from 'react-native';
import { getExtensionSettings } from 'shoutem.application';
import { ext as authExt, LOGIN, REGISTER } from 'shoutem.auth';
import { AUTHENTICATE_LIMITED, clearAuthState } from 'shoutem.auth/redux';
import { I18n } from 'shoutem.i18n';
import { NavigationStacks } from 'shoutem.navigation';
import { before, priorities, setPriority } from 'shoutem-core';
import { ext } from '../const';
import { isUserProfileCompleted } from './selectors';

function openUserProfileForm(
  canGoBack = false,
  shouldOpenCompletedScreen = true,
  callback,
) {
  return dispatch => {
    function onCancel() {
      if (!canGoBack) {
        return null;
      }

      return dispatch(clearAuthState()).then(() => {
        NavigationStacks.closeStack(ext());
      });
    }

    function onSubmitSuccess() {
      return dispatch(clearAuthState()).then(() => {
        NavigationStacks.closeStack(ext());

        if (callback) {
          callback();
        }
      });
    }

    return NavigationStacks.openStack(ext(), {
      canGoBack,
      shouldOpenCompletedScreen,
      onCancel,
      onSubmitSuccess,
    });
  };
}

// User approved: true
// Manually approve members: false
export const authenticateMiddleware = setPriority(
  store => next => action => {
    if (action.type === LOGIN || action.type === REGISTER) {
      const {
        payload: { callback: onAuthSuccessCallback, user },
      } = action;
      const state = store.getState();
      const { userProfileRequired } = getExtensionSettings(state, ext());
      const isUserProfileComplete = isUserProfileCompleted(state);

      if (!userProfileRequired || isUserProfileComplete) {
        return next(action);
      }

      // ! TODO: Disable gestures and back button
      // ! TODO: Show form only once
      return NavigationStacks.openStack(ext(), {
        canGoBack: false,
        shouldOpenCompletedScreen: false,
        onSubmitSuccess: () => {
          NavigationStacks.closeStack(ext());

          if (onAuthSuccessCallback) {
            onAuthSuccessCallback(user);
          }
        },
      });
    }

    return next(action);
  },
  before(priorities.AUTH),
);

// Manually approve members: true
// User approved: false
export const authenticateLimitedMiddleware = setPriority(
  store => next => action => {
    if (action.type === AUTHENTICATE_LIMITED) {
      const state = store.getState();
      const { userProfileRequired } = getExtensionSettings(state, ext());

      if (!userProfileRequired) {
        return next(action);
      }

      // User profile required
      const isUserProfileComplete = isUserProfileCompleted(state);

      if (isUserProfileComplete) {
        return Alert.alert(
          I18n.t(authExt('manualApprovalTitle')),
          I18n.t(authExt('manualApprovalMessage')),
          [
            {
              text: I18n.t(ext('editRequestButton')),
              onPress: () => store.dispatch(openUserProfileForm(true)),
            },
            {
              text: I18n.t(ext('okButton')),
              onPress: () => store.dispatch(clearAuthState()),
            },
          ],
          { cancelable: false },
        );
      }

      return store.dispatch(openUserProfileForm(false, true, action.payload));
    }

    return next(action);
  },
  before(priorities.AUTH),
);
