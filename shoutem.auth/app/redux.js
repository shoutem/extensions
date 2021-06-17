import _ from 'lodash';
import { combineReducers } from 'redux';
import {
  getAllShortcuts,
  getExtensionSettings,
  showAllShortcuts,
  hideShortcut,
  getConfiguration,
  getSubscriptionValidState,
} from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { createResetToCurrentRoute, navigateTo } from 'shoutem.navigation';
import { preventStateRehydration } from 'shoutem.redux';
import {
  find,
  resource,
  update,
  one,
  storage,
  getOne,
  create,
} from '@shoutem/redux-io';
import { chainReducers } from '@shoutem/redux-composers';
import { ext } from './const';
import encodeToBase64 from './shared/encodeToBase64';
import { shoutemApi } from './services/shoutemApi';

export const LOGIN = 'shoutem.auth.LOGIN';
export const LOGOUT = 'shoutem.auth.LOGOUT';
export const AUTHENTICATE = 'shoutem.auth.AUTHENTICATE';
export const REAUTHENTICATE_FAILED = 'shoutem.auth.REAUTHENTICATE_FAILED';
export const RESTORE_SESSION = 'shoutem.auth.RESTORE_SESSION';
export const REGISTER = 'shoutem.auth.REGISTER';
export const SET_ACCESS_TOKEN = 'shoutem.auth.SET_ACCESS_TOKEN';

export const USER_SCHEMA = 'shoutem.core.users';
export const USER_PROFILE_SCHEMA = 'shoutem.auth.user-profile';
export const USER_PROFILE_IMAGE_SCHEMA = 'shoutem.auth.user-profile-image';
export const USER_CREDENTIALS_SCHEMA = 'shoutem.auth.user-credentials';
export const USER_FORGOT_PASSWORD_ACTIONS_SCHEMA =
  'shoutem.auth.user-forgot-password-actions';
export const USER_RESET_PASSWORD_ACTIONS_SCHEMA =
  'shoutem.auth.user-reset-password-actions';
export const AUTH_TOKEN_SCHEMA = 'shoutem.auth.tokens';
export const USER_FACEBOOK_CREDENTIALS_SCHEMA =
  'shoutem.auth.user-facebook-credentials';
export const USER_APPLE_CREDENTIALS_SCHEMA =
  'shoutem.auth.user-apple-credentials';

export function restoreSession(session) {
  return {
    type: RESTORE_SESSION,
    payload: JSON.parse(session),
  };
}

const facebookUserInfoURL =
  'https://graph.facebook.com/me?fields=name,email,first_name,last_name&access_token=';

const sessionReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case RESTORE_SESSION:
      return { ...state, ...payload };
    case LOGOUT:
      return {};
    default:
      return { ...state };
  }
};

function setAccessToken(token) {
  return {
    type: SET_ACCESS_TOKEN,
    payload: {
      token,
    },
  };
}

function accessTokenReducer(state = '', { type, payload }) {
  switch (type) {
    case SET_ACCESS_TOKEN:
      return payload.token;
    default:
      return state;
  }
}

const userReducer = combineReducers({
  user: one(USER_SCHEMA, 'me', undefined),
  members: storage(USER_SCHEMA),
  session_id: (state = '') => state,
  access_token: accessTokenReducer,
});

export default preventStateRehydration(
  chainReducers([
    sessionReducer,
    resource(USER_CREDENTIALS_SCHEMA),
    userReducer,
  ]),
);

export function updateProfile(updates) {
  const newUser = { ...updates, type: USER_SCHEMA };

  return dispatch =>
    dispatch(update(USER_SCHEMA, newUser, { userId: updates.id }));
}

export const userLoggedIn = user => ({
  type: LOGIN,
  payload: user,
});

export const userRegistered = user => ({
  type: REGISTER,
  payload: user,
});

export function logout() {
  return {
    type: LOGOUT,
  };
}

export function authenticate(callback) {
  return {
    type: AUTHENTICATE,
    callback,
  };
}

export function fetchToken(tokenType, authHeader) {
  const schemeConfig = {
    schema: AUTH_TOKEN_SCHEMA,
    request: {
      headers: {
        Authorization: authHeader,
      },
    },
  };
  const token = {
    type: AUTH_TOKEN_SCHEMA,
    tokenType,
    subjectType: 'user',
  };

  return create(schemeConfig, token);
}

export function fetchAccessToken(email, password) {
  return dispatch =>
    dispatch(
      fetchToken(
        'refresh-token',
        `Basic ${encodeToBase64(`${email}:${password}`)}`,
      ),
    ).then(action =>
      dispatch(
        fetchToken(
          'access-token',
          `Bearer ${_.get(action, 'payload.data.attributes.token')}`,
        ),
      ),
    );
}

export function fetchAppleAccessToken(idToken) {
  return dispatch =>
    dispatch(fetchToken('refresh-token', `apple ${idToken}`)).then(action =>
      dispatch(
        fetchToken(
          'access-token',
          `Bearer ${_.get(action, 'payload.data.attributes.token')}`,
        ),
      ),
    );
}

export function fetchFacebookAccessToken(userAccessToken) {
  return dispatch =>
    dispatch(
      fetchToken('refresh-token', `facebook ${userAccessToken}`),
    ).then(action =>
      dispatch(
        fetchToken(
          'access-token',
          `Bearer ${_.get(action, 'payload.data.attributes.token')}`,
        ),
      ),
    );
}

export function fetchUser(userId = 'me') {
  return find(USER_SCHEMA, userId, { userId });
}

export function fetchFacebookUserInfo(userAccessToken) {
  const request = `${facebookUserInfoURL}${userAccessToken}`;

  return fetch(request)
    .then(response => response.json())
    .catch(error => console.log('Fetch Facebook user info failed: ', error));
}

export function login(email, password) {
  return dispatch =>
    dispatch(fetchAccessToken(email, password)).then(action => {
      const accessToken = _.get(action, 'payload.data.attributes.token');
      dispatch(setAccessToken(accessToken));

      return dispatch(fetchUser('me'));
    });
}

export function loginWithApple(idToken) {
  return dispatch =>
    dispatch(fetchAppleAccessToken(idToken)).then(action => {
      const accessToken = _.get(action, 'payload.data.attributes.token');
      dispatch(setAccessToken(accessToken));

      return dispatch(fetchUser('me'));
    });
}

export function loginWithFacebook(userAccessToken) {
  return dispatch =>
    dispatch(fetchFacebookAccessToken(userAccessToken)).then(action => {
      const accessToken = _.get(action, 'payload.data.attributes.token');
      dispatch(setAccessToken(accessToken));

      return dispatch(fetchUser('me'));
    });
}

export function register(
  email,
  username,
  password,
  gdprConsentGiven = false,
  newsletterConsentGiven = false,
) {
  return dispatch => {
    const schemeConfig = {
      schema: USER_SCHEMA,
      request: {
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Authorization: `Basic ${encodeToBase64(`${email}:${password}`)}`,
        },
      },
    };
    const user = {
      type: USER_SCHEMA,
      appRole: 'user',
      profile: {
        nick: username,
        gdprConsentGiven,
        newsletterConsentGiven,
      },
    };

    return dispatch(create(schemeConfig, user)).then(() =>
      dispatch(login(email, password)),
    );
  };
}

export function registerWithApple(idToken, firstName, lastName) {
  return dispatch => {
    const schemeConfig = {
      schema: USER_SCHEMA,
      request: {
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Authorization: `apple ${idToken}`,
        },
      },
    };
    const user = {
      type: USER_SCHEMA,
      appRole: 'user',
      profile: {
        firstName,
        lastName,
      },
    };

    return dispatch(create(schemeConfig, user)).then(() =>
      dispatch(loginWithApple(idToken)),
    );
  };
}

export function registerWithFacebook(userAccessToken, firstName, lastName) {
  return dispatch => {
    const schemeConfig = {
      schema: USER_SCHEMA,
      request: {
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Authorization: `facebook ${userAccessToken}`,
        },
      },
    };
    const user = {
      type: USER_SCHEMA,
      appRole: 'user',
      profile: {
        firstName,
        lastName,
      },
    };

    return dispatch(create(schemeConfig, user)).then(() =>
      dispatch(loginWithFacebook(userAccessToken)),
    );
  };
}

// function returns access token
export function getAccessToken(state) {
  return state[ext()].access_token;
}

export const isUserUpdateAction = action => {
  const schema = _.get(action, 'meta.schema');

  return _.includes([USER_PROFILE_SCHEMA, USER_PROFILE_IMAGE_SCHEMA], schema);
};

/**
 * Checks if user exists and if it does returns object with user data
 * if user doesn't exist function returns undefined
 * @param {Object} state App state
 */
export function getUser(state) {
  const { user } = state[ext()];

  if (_.isEmpty(user)) {
    return undefined;
  }

  return getOne(user, state);
}

/**
 * Checks whether the SendBird extension is installed and configured.
 * We check this in order to display or hide the chat button within the user
 * profile page.
 * @param {Object} state App state
 */
export function isSendBirdConfigured(state) {
  const config = getConfiguration(state);
  const hasValidSubscription = getSubscriptionValidState(state);
  const extensionInstalled = _.find(_.get(config, 'extensions'), {
    id: 'shoutem.sendbird',
  });
  const featureActive = _.get(
    extensionInstalled,
    'settings.featureActive',
    false,
  );

  return extensionInstalled && featureActive && hasValidSubscription;
}

/**
 * Checks whether the Agora extension is installed and configured.
 * We check this in order to display or hide the video call button within the user
 * profile page.
 * @param {Object} state App state
 */
export function isAgoraConfigured(state) {
  const config = getConfiguration(state);
  const extensionInstalled = _.find(_.get(config, 'extensions'), {
    id: 'shoutem.agora',
  });
  const apiKeySet = !_.isEmpty(_.get(extensionInstalled, 'settings.appId', ''));

  return extensionInstalled && apiKeySet;
}

/**
 * Checks whether user is logged in the application.
 * User is considered logged in if access token is in state
 * @param {Object} state App state
 */
export function isAuthenticated(state) {
  const accessToken = getAccessToken(state);
  return !!accessToken;
}

export function getUserGroups(state) {
  const user = getUser(state);
  return _.get(user, 'userGroups');
}

export function logoutAction() {
  return dispatch => {
    dispatch(logout());
  };
}

export function openProfile(user, title = I18n.t(ext('profileNavBarTitle'))) {
  const route = {
    screen: ext('UserProfileScreen'),
    title,
    props: {
      user,
    },
  };
  return navigateTo(route);
}

export function hideShortcuts(user) {
  return (dispatch, getState) => {
    const state = getState();
    const { allScreensProtected } = getExtensionSettings(state, ext());
    const shortcuts = getAllShortcuts(state);

    const userGroups = _.get(user, 'userGroups');
    const userGroupsIds = _.map(userGroups, 'id');

    dispatch(showAllShortcuts());

    if (!allScreensProtected) {
      return;
    }

    _.forEach(shortcuts, shortcut => {
      const shortcutUserGroups = _.get(shortcut, [
        'settings',
        _.camelCase(ext()),
        'userGroups',
      ]);
      const userGroupsEmpty = _.isEmpty(shortcutUserGroups);

      if (userGroupsEmpty) {
        return;
      }

      const shortcutUserGroupIds = _.map(shortcutUserGroups, 'id');
      const isShortcutHiddenToUser = _.isEmpty(
        _.intersection(userGroupsIds, shortcutUserGroupIds),
      );

      if (isShortcutHiddenToUser) {
        dispatch(hideShortcut(shortcut.id));
      }
    });
  };
}

export function createResetToLoginScreen() {
  return (dispatch, getState) => {
    const state = getState();

    return createResetToCurrentRoute(state, dispatch);
  };
}

export function sendVerificationCodeEmail(email) {
  const config = {
    schema: USER_FORGOT_PASSWORD_ACTIONS_SCHEMA,
    request: {
      endpoint: shoutemApi.buildAuthUrl('users/actions/forgot-password'),
      body: JSON.stringify({
        data: {
          type: USER_FORGOT_PASSWORD_ACTIONS_SCHEMA,
          attributes: {
            email,
          },
        },
      }),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  return create(config);
}

export function resetPassword(code, email, newPassword) {
  const config = {
    schema: USER_RESET_PASSWORD_ACTIONS_SCHEMA,
    request: {
      endpoint: shoutemApi.buildAuthUrl('users/actions/reset-password'),
      body: JSON.stringify({
        data: {
          type: USER_RESET_PASSWORD_ACTIONS_SCHEMA,
          attributes: {
            email,
            code,
            newPassword,
          },
        },
      }),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  return create(config);
}
