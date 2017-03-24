import { getAppId } from 'shoutem.application';

import { AsyncStorage } from 'react-native';

import { ext } from './const';

const storageKey = `app-${getAppId()}:${ext()}.session`;

export const saveSession = session => AsyncStorage.setItem(storageKey, session);

export const clearSession = () => AsyncStorage.removeItem(storageKey);

export const getSession = () => AsyncStorage.getItem(storageKey);
