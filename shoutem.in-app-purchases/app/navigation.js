import { NavigationStacks, Decorators } from 'shoutem.navigation';
import { SubscriptionsScreen } from './screens';
import { withSubscriptionRequired } from './services';
import { ext } from './const';

Decorators.registerDecorator(withSubscriptionRequired);

NavigationStacks.registerNavigationStack({
  name: ext(),
  screens: [
    {
      name: ext('SubscriptionsScreen'),
      component: SubscriptionsScreen,
    },
  ],
});
