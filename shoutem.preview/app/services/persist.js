import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';

export async function clearPreviewStorage() {
  const keys = await AsyncStorage.getAllKeys();

  // Preview apps AsyncStorage keys all start with reduxPersist
  const keysToRemove = _.filter(keys, key => key.match(/^(reduxPersist:)/g));

  return AsyncStorage.multiRemove(keysToRemove);
}
