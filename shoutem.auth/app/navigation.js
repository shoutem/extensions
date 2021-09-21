import { NavigationStacks, Decorators, ModalScreens } from 'shoutem.navigation';
import { withLoginRequired } from './loginRequired';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import PasswordRecoveryScreen from './screens/PasswordRecoveryScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import { ext, SENDBIRD_SCREEN_ID, AGORA_SCREEN_ID } from './const';

Decorators.registerDecorator(withLoginRequired);

NavigationStacks.registerNavigationStack({
  name: ext(),
  screens: [
    {
      name: ext('LoginScreen'),
      component: LoginScreen,
    },
    {
      name: ext('RegisterScreen'),
      component: RegisterScreen,
    },
    {
      name: ext('PasswordRecoveryScreen'),
      component: PasswordRecoveryScreen,
    },
    {
      name: ext('ChangePasswordScreen'),
      component: ChangePasswordScreen,
    },
  ],
});

ModalScreens.registerModalScreens([
  ext('EditProfileScreen'),
  AGORA_SCREEN_ID,
  SENDBIRD_SCREEN_ID,
]);
