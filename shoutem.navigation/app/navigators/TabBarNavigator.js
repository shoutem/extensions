import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { HeaderBackButton } from '../components';
import { ext } from '../const';
import NoScreens from '../screens/NoScreens';
import { createChildNavigators, getRouteParams } from '../services';

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

function Navigator({ parentShortcut, hiddenShortcuts, screens, style }) {
  const TabComponents = createChildNavigators(
    parentShortcut,
    TabBarStack,
    screenOptions,
    false,
    hiddenShortcuts,
    screens,
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
      {_.slice(TabComponents, 0, 5)}
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
