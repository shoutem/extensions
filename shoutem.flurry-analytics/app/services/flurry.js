import _ from 'lodash';
import { Platform } from 'react-native';

import { isProduction, getExtensionSettings } from 'shoutem.application';

import { ext } from '../const';

const production = isProduction();
let platformApiKey = false;

export function isFlurryActive(state) {
  if (!production) {
    return false;
  }

  if (platformApiKey === false) {
    const extensionSettings = getExtensionSettings(state, ext());
    platformApiKey = _.get(extensionSettings, [Platform.OS, 'apiKey']);
  }

  return !_.isEmpty(platformApiKey);
}
