import { NavigationStacks } from 'shoutem.navigation';
import { ext, VERIFICATION_STACK } from './const';
import { AgeRestrictionScreen } from './screens';

NavigationStacks.registerNavigationStack({
  name: VERIFICATION_STACK,
  screens: [
    {
      name: ext('AgeRestrictionScreen'),
      component: AgeRestrictionScreen,
    },
  ],
});
