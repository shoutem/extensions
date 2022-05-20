import React from 'react';
import { StatusBar } from 'react-native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  DRAWER,
  GRID_STACK,
  MODAL,
  NO_CONTENT,
  NO_SCREENS,
  NONE,
  TAB_BAR,
} from '../const';
import { NoContent, NoScreens } from '../screens';
import { HeaderStyles } from '../services';
import {
  createRootCustomStackNavigators,
  DrawerNavigator,
  ModalNavigator,
  NoneStackNavigator,
  StackNavigator,
  TabBarNavigator,
} from '.';

// Used to differentiate main app tree and the modal stack
const ParentStack = createStackNavigator();
// Root navigation stack that contains all other stacks
const RootStack = createStackNavigator();

export function NavigationTree({
  firstShortcut,
  shortcuts,
  screens,
  hiddenShortcuts,
}) {
  const parentShortcutId = _.get(firstShortcut, 'id');
  const parentShortcut = _.find(shortcuts, { id: parentShortcutId });
  const parentScreen = _.get(parentShortcut, 'screens[0]');
  const layoutType = _.get(parentScreen, 'canonicalName');
  const isDrawerLayout = layoutType === DRAWER;
  const isTabBarLayout = layoutType === TAB_BAR;
  const isNoneLayout = layoutType === NONE;
  const isStackLayout = !isDrawerLayout && !isTabBarLayout && !isNoneLayout;

  const RootCustomNavigators = createRootCustomStackNavigators(RootStack);

  return (
    <>
      <StatusBar
        animated
        barStyle={HeaderStyles.statusBarStyle}
        backgroundColor={HeaderStyles.default?.headerStyle?.backgroundColor}
      />
      <ParentStack.Navigator
        headerMode="none"
        mode="modal"
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <ParentStack.Screen name="root_stack">
          {() => (
            <RootStack.Navigator headerMode="none">
              {isStackLayout && (
                <RootStack.Screen name={GRID_STACK}>
                  {() => (
                    <StackNavigator
                      parentShortcut={parentShortcut}
                      hiddenShortcuts={hiddenShortcuts}
                      screens={screens}
                    />
                  )}
                </RootStack.Screen>
              )}
              {isDrawerLayout && (
                <RootStack.Screen name={DRAWER}>
                  {() => (
                    <DrawerNavigator
                      parentShortcut={parentShortcut}
                      hiddenShortcuts={hiddenShortcuts}
                      screens={screens}
                    />
                  )}
                </RootStack.Screen>
              )}
              {isTabBarLayout && (
                <RootStack.Screen name={TAB_BAR}>
                  {() => (
                    <TabBarNavigator
                      parentShortcut={parentShortcut}
                      hiddenShortcuts={hiddenShortcuts}
                      screens={screens}
                    />
                  )}
                </RootStack.Screen>
              )}
              {isNoneLayout && (
                <RootStack.Screen name={NONE}>
                  {() => (
                    <NoneStackNavigator
                      parentShortcut={parentShortcut}
                      hiddenShortcuts={hiddenShortcuts}
                      screens={screens}
                    />
                  )}
                </RootStack.Screen>
              )}
              <RootStack.Screen name={NO_SCREENS} component={NoScreens} />
              <RootStack.Screen name={NO_CONTENT} component={NoContent} />
              {RootCustomNavigators}
            </RootStack.Navigator>
          )}
        </ParentStack.Screen>
        <ParentStack.Screen name={MODAL}>
          {() => <ModalNavigator screens={screens} />}
        </ParentStack.Screen>
      </ParentStack.Navigator>
    </>
  );
}

NavigationTree.propTypes = {
  firstShortcut: PropTypes.object.isRequired,
  hiddenShortcuts: PropTypes.array.isRequired,
  screens: PropTypes.object.isRequired,
  shortcuts: PropTypes.array.isRequired,
};
