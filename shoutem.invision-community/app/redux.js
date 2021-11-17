import { create } from '@shoutem/redux-io';
import {
  fetchToken,
  fetchUser,
  setAccessToken,
  USER_SCHEMA,
} from 'shoutem.auth';
import { shoutemApi } from './services';

export function fetchInvisionAccessToken(invisionToken) {
  return dispatch =>
    dispatch(
      fetchToken('refresh-token', `invision ${invisionToken}`),
    ).then(action =>
      dispatch(
        fetchToken(
          'access-token',
          `Bearer ${action.payload.data?.attributes?.token}`,
        ),
      ),
    );
}

export function loginWithInvision(userAccessToken) {
  return dispatch =>
    dispatch(fetchInvisionAccessToken(userAccessToken)).then(tokenInfo => {
      const accessToken = tokenInfo.payload.data?.attributes?.token;
      dispatch(setAccessToken(accessToken));

      return dispatch(fetchUser('me'));
    });
}

export function registerWithInvision(invisionToken, approved) {
  return dispatch => {
    const endpoint = shoutemApi.buildAuthUrl('users');
    const schemeConfig = {
      schema: USER_SCHEMA,
      request: {
        endpoint,
        headers: {
          accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          Authorization: `invision ${invisionToken}`,
        },
      },
    };
    const user = {
      type: USER_SCHEMA,
      appRole: 'user',
      approved,
    };

    return dispatch(create(schemeConfig, user))
      .then(() => {
        dispatch(loginWithInvision(invisionToken));
      })
      .catch(error => {
        if (error.payload?.status === 409) {
          dispatch(loginWithInvision(invisionToken));
        } else {
          // eslint-disable-next-line no-console
          console.error(
            'Error creating Shoutem user via Invision Community.',
            error,
          );
        }
      });
  };
}
