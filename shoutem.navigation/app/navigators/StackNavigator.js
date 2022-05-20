import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { HeaderBackButton, HeaderTitle } from '../components';
import { createChildNavigators, HeaderStyles } from '../services';
import { createCustomStackNavigators } from './CustomStackNavigators';

const GridStack = createStackNavigator();

function screenOptions() {
  return {
    ...TransitionPresets.SlideFromRightIOS,
    headerLeft: props => <HeaderBackButton {...props} />,
    headerTitleAlign: 'center',
  };
}

export function StackNavigator({ parentShortcut, hiddenShortcuts, screens }) {
  const parentScreen = _.get(parentShortcut, 'screens[0]');
  const layoutType = _.get(parentScreen, 'canonicalName');

  const StackComponents = createChildNavigators(
    parentShortcut,
    GridStack,
    screenOptions,
    false,
    hiddenShortcuts,
    screens,
    { headerShown: false },
  );

  const CustomNavigators = createCustomStackNavigators(GridStack);

  return (
    <GridStack.Navigator
      screenOptions={{
        headerShown: false,
        ...HeaderStyles.default,
        ...TransitionPresets.SlideFromRightIOS,
        headerTitleAlign: 'center',
      }}
    >
      <GridStack.Screen
        name="root_layout"
        component={screens[layoutType]}
        options={{
          ...(Platform.OS !== 'ios' && {
            safeAreaInsets: { top: 0 },
          }),
          headerShown: true,
          // eslint-disable-next-line react/prop-types
          headerTitle: ({ style, children }) => (
            <HeaderTitle
              style={style}
              shortcut={parentShortcut}
              title={children}
            />
          ),
        }}
        initialParams={{
          shortcut: parentShortcut,
          screenSettings: parentScreen.settings,
          isRootScreen: true,
        }}
      />
      {[...StackComponents, ...CustomNavigators]}
    </GridStack.Navigator>
  );
}

StackNavigator.propTypes = {
  parentShortcut: PropTypes.object,
  hiddenShortcuts: PropTypes.array,
  screens: PropTypes.object,
};
