import { NavigationStacks, Decorators } from 'shoutem.navigation';
import { RestrictedScreen } from './screens';
import { withGeoLocationRequired } from './hoc';
import { ext } from './const';

Decorators.registerDecorator(withGeoLocationRequired);

NavigationStacks.registerNavigationStack({
  name: ext(),
  screens: [
    {
      name: ext('RestrictedScreen'),
      component: RestrictedScreen
    },
  ],
});
