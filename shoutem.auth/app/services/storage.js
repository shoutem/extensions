import AsyncStorage from '@react-native-community/async-storage';

export function saveItem(itemKey, item) {
  if (item) {
    AsyncStorage.setItem(itemKey, item);
  }
}

export function clearItem(itemKey) {
  AsyncStorage.removeItem(itemKey);
}

export function getItem(itemKey) {
  return AsyncStorage.getItem(itemKey).then(result => {
    const storageFirstName = result || '';
    return storageFirstName;
  });
}
