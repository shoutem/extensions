import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HeaderBackButton } from '../components';
import { getRouteParams, createChildNavigators } from '../services';
import { ext } from '../const';

const TabBarStack = createBottomTabNavigator();

function screenOptions(props) {
  const { isFirstScreen } = getRouteParams(props);

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

function Navigator({
  parentShortcut,
  hiddenShortcuts,
  decoratedScreens,
  style,
}) {
  const TabComponents = createChildNavigators(
    parentShortcut,
    TabBarStack,
    screenOptions,
    false,
    hiddenShortcuts,
    decoratedScreens,
  );

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
      {_.slice(TabComponents, 0, 5)}
    </TabBarStack.Navigator>
  );
}

Navigator.propTypes = {
  parentShortcut: PropTypes.object,
  hiddenShortcuts: PropTypes.array,
  decoratedScreens: PropTypes.object,
  style: PropTypes.object,
};

export const TabBarNavigator = connectStyle(ext('TabBar'))(Navigator);
