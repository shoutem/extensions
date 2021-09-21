import { NavigationStacks } from 'shoutem.navigation';
import { OnboardingScreen } from './screens';
import { ext } from './const';

NavigationStacks.registerNavigationStack({
  name: ext(),
  screens: [
    {
      name: ext('OnboardingScreen'),
      component: OnboardingScreen,
    },
  ],
});
