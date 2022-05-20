// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import _ from 'lodash';
import { AppInitQueue } from 'shoutem.application';
import './navigation';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import ConfirmDeletionScreen from './screens/ConfirmDeletionScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import LoginScreen from './screens/LoginScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import PasswordRecoveryScreen from './screens/PasswordRecoveryScreen';
import RegisterScreen from './screens/RegisterScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import enTranslations from './translations/en.json';
import { ext } from './const';
import { getErrorCode, getErrorMessage } from './errorMessages';
import { loginRequired, withLoginRequired } from './loginRequired';
import {
  authenticateLimitedMiddleware,
  authenticateMiddleware,
  logoutMiddleware,
  networkRequestMiddleware,
  userUpdatedMiddleware,
} from './middleware';
import reducer, {
  authenticate,
  checkUsernameAvailability,
  fetchToken,
  fetchUser,
  getAccessToken,
  getUser,
  getUserGroups,
  hideShortcuts,
  isAuthenticated,
  isUserUpdateAction,
  LOGIN,
  login,
  LOGIN_INITIALIZED,
  LOGOUT,
  logoutAction,
  openProfile,
  REGISTER,
  register,
  resetPassword,
  RESTORE_SESSION,
  setAccessToken,
  updateProfile,
  USER_SCHEMA,
  userAuthenticatedLimited,
  userLoggedIn,
  userRegistered,
} from './redux';
import { saveSession } from './session';

AppInitQueue.addExtension(ext());

const appScreens = {};

function appWillMount(app) {
  _.each(app.getScreens(), (Screen, screenName) => {
    appScreens[screenName] = Screen;
  });
}

export { authProviders } from './services/authProviders';

export const screens = {
  LoginScreen,
  RegisterScreen,
  UserProfileScreen,
  EditProfileScreen,
  MyProfileScreen,
  PasswordRecoveryScreen,
  ChangePasswordScreen,
  ConfirmDeletionScreen,
};

export { reducer };

export const actions = {
  logoutAction,
};

const middleware = [
  networkRequestMiddleware,
  logoutMiddleware,
  userUpdatedMiddleware,
  authenticateMiddleware,
  authenticateLimitedMiddleware,
];

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { appDidMount, appWillUnmount } from './app';
export { AuthContext as context, renderProvider } from './providers';

export {
  appScreens,
  appWillMount,
  authenticate,
  checkUsernameAvailability,
  ext,
  fetchToken,
  fetchUser,
  getAccessToken,
  getErrorCode,
  getErrorMessage,
  getUser,
  getUserGroups,
  hideShortcuts,
  isAuthenticated,
  isUserUpdateAction,
  LOGIN,
  login,
  LOGIN_INITIALIZED,
  loginRequired,
  LOGOUT,
  middleware,
  openProfile,
  REGISTER,
  register,
  resetPassword,
  RESTORE_SESSION,
  saveSession,
  setAccessToken,
  updateProfile,
  USER_SCHEMA,
  userAuthenticatedLimited,
  userLoggedIn,
  userRegistered,
  withLoginRequired,
};
