import React from 'react';
import { TransitionPresets } from '@react-navigation/stack';
import _ from 'lodash';
import {
  Decorators,
  HeaderBackButton,
  ModalScreens,
  NavigationStacks,
} from 'shoutem.navigation';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import LoginScreen from './screens/LoginScreen';
import PasswordRecoveryScreen from './screens/PasswordRecoveryScreen';
import RegisterScreen from './screens/RegisterScreen';
import { AGORA_SCREEN_ID, ext, SENDBIRD_SCREEN_ID } from './const';
import { withLoginRequired } from './loginRequired';

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
  screenOptions: navParams => {
    const onCancel = _.get(navParams, 'route.params.onCancel');

    return {
      headerLeft: _.get(navParams, 'route.params.canGoBack', false)
        ? props => <HeaderBackButton {...props} onPress={onCancel} />
        : null,
      ...TransitionPresets.SlideFromRightIOS,
      headerTitleAlign: 'center',
    };
  },
  rootStack: false,
});

ModalScreens.registerModalScreens([
  ext('EditProfileScreen'),
  ext('ConfirmDeletionScreen'),
  AGORA_SCREEN_ID,
  SENDBIRD_SCREEN_ID,
]);
