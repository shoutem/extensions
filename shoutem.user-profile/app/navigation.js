import { ModalScreens, NavigationStacks } from 'shoutem.navigation';
import { isWeb } from 'shoutem-core';
import EditProfileScreen from './screens/EditProfileScreen';
import SubmissionCompletedScreen from './screens/SubmissionCompletedScreen';
import { AGORA_SCREEN_ID, ext, SENDBIRD_SCREEN_ID } from './const';

NavigationStacks.registerNavigationStack({
  name: ext(),
  screens: [
    {
      name: ext('EditProfileScreen'),
      component: EditProfileScreen,
    },
    {
      name: ext('SubmissionCompletedScreen'),
      component: SubmissionCompletedScreen,
    },
  ],
});

ModalScreens.registerModalScreens([
  ...(isWeb ? [] : [AGORA_SCREEN_ID]),
  SENDBIRD_SCREEN_ID,
  ext('EditProfileScreen'),
]);
