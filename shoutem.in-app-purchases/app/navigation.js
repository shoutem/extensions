import React from 'react';
import { TransitionPresets } from '@react-navigation/stack';
import _ from 'lodash';
import {
  Decorators,
  HeaderBackButton,
  NavigationStacks,
} from 'shoutem.navigation';
import { ext } from './const';
import { SubscriptionsScreen, SuccessScreen } from './screens';
import { withSubscriptionRequired } from './services';

Decorators.registerDecorator(withSubscriptionRequired);

NavigationStacks.registerNavigationStack({
  name: ext(),
  screens: [
    {
      name: ext('SubscriptionsScreen'),
      component: SubscriptionsScreen,
    },
    {
      name: ext('SuccessScreen'),
      component: SuccessScreen,
    },
  ],
  screenOptions: navParams => {
    const onCancel = _.get(navParams, 'route.params.onCancel');

    return {
      title: null,
      headerLeft: _.get(navParams, 'route.params.canGoBack', false)
        ? props => <HeaderBackButton {...props} onPress={onCancel} />
        : null,
      ...TransitionPresets.SlideFromRightIOS,
    };
  },
  rootStack: false,
});
