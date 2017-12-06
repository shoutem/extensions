import { url, appId, auth } from 'environment';
import { RSAA } from 'redux-api-middleware';
import URI from 'urijs';
import { rsaaPromise } from './services';

export const LOAD_FIREBASE_CONFIG_REQUEST = 'LOAD_FIREBASE_CONFIG_REQUEST';
export const LOAD_FIREBASE_CONFIG_SUCCESS = 'LOAD_FIREBASE_CONFIG_SUCCESS';
export const LOAD_FIREBASE_CONFIG_ERROR = 'LOAD_FIREBASE_CONFIG_ERROR';

export const UPDATE_FIREBASE_CONFIG_REQUEST = 'UPDATE_FIREBASE_CONFIG_REQUEST';
export const UPDATE_FIREBASE_CONFIG_SUCCESS = 'UPDATE_FIREBASE_CONFIG_SUCCESS';
export const UPDATE_FIREBASE_CONFIG_ERROR = 'UPDATE_FIREBASE_CONFIG_ERROR';

const getFirebaseLegacyEndpoint = () => {
  const baseUrl = url.legacy;
  const session = auth.session;
  return new URI()
    .protocol('')
    .host(baseUrl)
    .segment([
      appId,
      'firebase',
      'objects',
      'FirebaseProject',
    ])
    .query({ session_id: session })
    .toString();
};

export function fetchFirebaseConfig() {
  const fetchFirebaseConfigRequest = {
    [RSAA]: {
      endpoint: getFirebaseLegacyEndpoint(),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
      types: [
        LOAD_FIREBASE_CONFIG_REQUEST,
        LOAD_FIREBASE_CONFIG_SUCCESS,
        LOAD_FIREBASE_CONFIG_ERROR,
      ],
    },
  };

  return rsaaPromise(fetchFirebaseConfigRequest);
}

export function updateFirebaseConfig(newConfig) {
  const updateFirebaseConfigRequest = {
    [RSAA]: {
      endpoint: getFirebaseLegacyEndpoint(),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(newConfig),
      types: [
        UPDATE_FIREBASE_CONFIG_REQUEST,
        UPDATE_FIREBASE_CONFIG_SUCCESS,
        UPDATE_FIREBASE_CONFIG_ERROR,
      ],
    },
  };

  return rsaaPromise(updateFirebaseConfigRequest);
}
