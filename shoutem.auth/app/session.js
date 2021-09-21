import { getAppId } from 'shoutem.application';

import AsyncStorage from '@react-native-community/async-storage';

import { ext } from './const';

export function getStorageKey() {
  return `app-${getAppId()}:${ext()}.session`;
}

export const saveSession = session =>
  AsyncStorage.setItem(getStorageKey(), session);

export const clearSession = () => AsyncStorage.removeItem(getStorageKey());

export const getSession = () => AsyncStorage.getItem(getStorageKey());
