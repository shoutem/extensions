import React from 'react';
import { TransitionPresets } from '@react-navigation/stack';
import _ from 'lodash';
import {
  Decorators,
  HeaderBackButton,
  NavigationStacks,
} from 'shoutem.navigation';
import { ext } from './const';
import { withGeoLocationRequired } from './hoc';
import { RestrictedScreen } from './screens';

Decorators.registerDecorator(withGeoLocationRequired);

NavigationStacks.registerNavigationStack({
  name: ext(),
  screens: [
    {
      name: ext('RestrictedScreen'),
      component: RestrictedScreen,
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
      headerTitleAlign: 'center',
    };
  },
  rootStack: false,
});
