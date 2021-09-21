import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import _ from 'lodash';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { HeaderTitle, HeaderBackButton } from '../components';
import { HeaderStyles, createChildNavigators } from '../services';

const GridStack = createStackNavigator();

function screenOptions() {
  return {
    ...TransitionPresets.SlideFromRightIOS,
    headerLeft: props => <HeaderBackButton {...props} />,
    headerTitleAlign: 'center',
  };
}

export function StackNavigator({
  parentShortcut,
  hiddenShortcuts,
  decoratedScreens,
}) {
  const parentScreen = _.get(parentShortcut, 'screens[0]');
  const layoutType = _.get(parentScreen, 'canonicalName');

  const StackComponents = createChildNavigators(
    parentShortcut,
    GridStack,
    screenOptions,
    false,
    hiddenShortcuts,
    decoratedScreens,
    { headerShown: false },
  );

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
        component={decoratedScreens[layoutType]}
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
      {StackComponents}
    </GridStack.Navigator>
  );
}

StackNavigator.propTypes = {
  parentShortcut: PropTypes.object,
  hiddenShortcuts: PropTypes.array,
  decoratedScreens: PropTypes.object,
};
