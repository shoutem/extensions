import AsyncStorage from '@react-native-community/async-storage';
import { ext } from '../const';

const APPLICATION_EXTENSION = 'shoutem.application';

export function getStateFromAsyncStorage() {
  return new Promise(resolve => {
    AsyncStorage.getItem(`reduxPersist:${ext()}`).then(
      unparsedExtensionState => {
        const extensionState = JSON.parse(unparsedExtensionState);

        if (extensionState) {
          return AsyncStorage.getItem(
            `reduxPersist:${APPLICATION_EXTENSION}`,
          ).then(unparsedApplicationState => {
            const applicationState = JSON.parse(unparsedApplicationState);

            if (applicationState) {
              return resolve({
                [ext()]: extensionState,
                [APPLICATION_EXTENSION]: applicationState,
              });
            }

            return resolve({ [ext()]: extensionState });
          });
        }

        return resolve({});
      },
    );
  });
}
