import { ModalScreens } from 'shoutem.navigation';
import { screens as authScreens } from 'shoutem.auth';
import { ext } from './const';

const UserProfileScreen = authScreens.UserProfileScreen;

ModalScreens.registerModalScreens([
  {
    name: ext('UserProfileScreen'),
    component: UserProfileScreen,
  },
]);
