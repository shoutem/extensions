import { Decorators, NavigationStacks } from 'shoutem.navigation';
import { ext } from './const';
import { SubscriptionsScreen } from './screens';
import { withSubscriptionRequired } from './services';

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
