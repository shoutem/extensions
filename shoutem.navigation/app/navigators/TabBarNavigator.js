import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { HeaderBackButton, TabBarItem } from '../components';
import { ext } from '../const';
import NoScreens from '../screens/NoScreens';
import { createChildNavigators, getRouteParams } from '../services';
import { createCustomStackNavigators } from './CustomStackNavigators';

const TabBarStack = createBottomTabNavigator();

function screenOptions(navigationProps) {
  const { isFirstScreen } = getRouteParams(navigationProps);

  return {
    headerLeft: props => {
      if (isFirstScreen) {
        return null;
      }

      return <HeaderBackButton {...props} />;
    },
    headerTitleAlign: 'center',
  };
}

function customStackScreenOptions(navigationProps) {
  const parentState = navigationProps.navigation.getParent().getState();
  const { isFirstScreen, previousRoute, onBack } = getRouteParams(
    navigationProps,
  );

  const prevRouteContainedInTabBar = _.find(parentState.routes, route => {
    if (_.get(route, 'params.screen') === previousRoute.name) {
      return true;
    }
    return false;
  });

  const prevPreviousRoute = _.get(previousRoute, 'params.previousRoute');
  const isFromRootShortcut =
    !prevPreviousRoute ||
    (parentState.type === 'tab' && prevRouteContainedInTabBar);

  return {
    headerLeft: props => {
      if (isFirstScreen && isFromRootShortcut) {
        return null;
      }

      // Mostly, we want to control the visibility of the drawer icon in the top left
      // This causes a few issues with the custom navigator screen options that have custom
      // headerLeft implementation, as these have presedence when resolving screenOptions.
      // For this purpose, we include onBack route prop,
      // which will be used by any form of backbutton enforced by parent navigator like
      // Drawer or TabBar
      const defaultBackHandler = onBack || navigationProps.navigation.goBack;

      return <HeaderBackButton {...props} onPress={defaultBackHandler} />;
    },
    headerTitleAlign: 'center',
  };
}

function Navigator({ parentShortcut, hiddenShortcuts, screens, style }) {
  const TabComponents = createChildNavigators(
    parentShortcut,
    TabBarStack,
    screenOptions,
    false,
    hiddenShortcuts,
    screens,
  );
  const CustomNavigators = createCustomStackNavigators(
    TabBarStack,
    {
      screenOptions: customStackScreenOptions,
    },
    { tabBarButton: props => <TabBarItem {...props} selected={false} /> },
  );

  if (_.size(TabComponents) < 1) {
    return <NoScreens />;
  }

  return (
    <TabBarStack.Navigator
      tabBarOptions={{
        activeTintColor: style.activeTintColor,
        inactiveTintColor: style.inactiveTintColor,
        activeBackgroundColor: style.activeBackgroundColor,
        inactiveBackgroundColor: style.inactiveBackgroundColor,
        style: style.container,
      }}
    >
      {[..._.slice(TabComponents, 0, 5), ...CustomNavigators]}
    </TabBarStack.Navigator>
  );
}

Navigator.propTypes = {
  parentShortcut: PropTypes.object.isRequired,
  screens: PropTypes.object.isRequired,
  hiddenShortcuts: PropTypes.array,
  style: PropTypes.object,
};

Navigator.defaultProps = {
  hiddenShortcuts: [],
  style: {},
};

export const TabBarNavigator = connectStyle(ext('TabBar'))(Navigator);
