import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Linking } from 'react-native';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import { authProviders, logoutAction } from 'shoutem.auth';
import LoginButton from './fragments/LoginButton';
import LoginScreen from './screens/LoginScreen';
import { ext } from './const';
import { registerWithInvision } from './redux';
import { shoutemApi } from './services';

export function getStorageKey() {
  return `app-${getAppId()}:${ext()}.invisionToken`;
}

export function clearInvisionToken() {
  return AsyncStorage.removeItem(getStorageKey());
}

export function getInvisionToken() {
  return AsyncStorage.getItem(getStorageKey());
}

export function saveInvisionToken(token) {
  return AsyncStorage.setItem(getStorageKey(), token);
}

export function checkInvisionToken(invisionApiUrl, token) {
  return new Promise((resolve, reject) => {
    fetch(`${invisionApiUrl}/core/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (response.status === 200) {
          resolve(true);
        }

        clearInvisionToken().then(() => resolve(false));
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error validating Invision Community token:', error);
        clearInvisionToken().then(() => reject(false));
      });
  });
}

export function renderLoginButton() {
  return <LoginButton />;
}

export function renderLoginScreen() {
  return <LoginScreen />;
}

// 'noOtherProviderAction' is executed if there are no other providers available
const invisionAuthProvider = {
  name: ext().split('.')[1],
  noOtherProviderAction: null,
  renderLoginButton,
  renderLoginScreen,
};

async function handleDeepLink(urlInfo, approved, dispatch) {
  if (!urlInfo) {
    return;
  }

  const { url } = urlInfo;
  // Checking if this is for the invision-community extension, can't use
  // 'shoutem.' because of whitelabeling.
  if (!url.includes(`${ext().split('.')[1]}/token`)) {
    return;
  }

  // Redirect link is appended with:
  // #access_token=<token>&token_type=bearer&expires_in=<expiration_in_seconds>
  const invisionTokenInfo = url.split('#access_token=')[1];
  const invisionToken = invisionTokenInfo.split('&')[0];

  await saveInvisionToken(invisionToken);
  await dispatch(registerWithInvision(invisionToken, approved));
}

export async function appDidMount(app) {
  authProviders.addProvider(invisionAuthProvider);

  const store = app.getStore();
  const state = store.getState();
  const { dispatch } = store;

  const authSettings = getExtensionSettings(state, 'shoutem.auth');
  const { manuallyApproveMembers } = authSettings;

  Linking.addEventListener('url', urlInfo =>
    handleDeepLink(urlInfo, !manuallyApproveMembers, dispatch),
  );

  // Cannot use await for some reason, have to use .then to handle initial URL.
  Linking.getInitialURL().then(urlInfo =>
    handleDeepLink(urlInfo, !manuallyApproveMembers, dispatch),
  );

  const token = await getInvisionToken();

  if (token) {
    const { invisionApiUrl } = getExtensionSettings(state, ext());
    const tokenIsValid = await checkInvisionToken(invisionApiUrl, token);

    if (!tokenIsValid) {
      await dispatch(logoutAction());
    }
  }

  const appId = getAppId();

  const { authApiEndpoint } = authSettings;

  shoutemApi.init(authApiEndpoint, appId);
}
