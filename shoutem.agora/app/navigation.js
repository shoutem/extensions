import { ModalScreens } from 'shoutem.navigation';
import { isWeb } from 'shoutem-core';
import { ext } from './const';

if (!isWeb) {
  ModalScreens.registerModalScreens([ext('VideoCallScreen')]);
}
