import { NavigationStacks } from 'shoutem.navigation';
import { ext } from './const';
import { OnboardingScreen } from './screens';

NavigationStacks.registerNavigationStack({
  name: ext(),
  screens: [
    {
      name: ext('OnboardingScreen'),
      component: OnboardingScreen,
    },
  ],
});
