import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar } from 'react-native';
import _ from 'lodash';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import {
  NO_SCREENS,
  NO_CONTENT,
  DRAWER,
  MODAL,
  TAB_BAR,
  GRID_STACK,
  NONE,
} from '../const';
import { NoScreens, NoContent } from '../screens';
import { HeaderStyles, Decorators } from '../services';
import {
  DrawerNavigator,
  TabBarNavigator,
  ModalNavigator,
  StackNavigator,
  NoneStackNavigator,
  createCustomStackNavigators,
} from '.';

// Used to differentiate main app tree and the modal stack
const ParentStack = createStackNavigator();
// Root navigation stack that contains all other stacks
const RootStack = createStackNavigator();

// Collect all registered screen decorators and
// create one that holds all of the logic, that
// will be applied to each screen contained in any child navigator
function createScreenDecorator() {
  const decorators = Decorators.getDecorators();

  return _.reduce(
    decorators,
    (result, decorator) => {
      return screen => hoistNonReactStatics(decorator(result(screen)), screen);
    },
    screen => screen,
  );
}

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

  const screenDecorator = createScreenDecorator();

  const decoratedScreens = _.reduce(
    screens,
    (result, screen, name) => ({
      ...result,
      [name]: screenDecorator(screen),
    }),
    {},
  );

  const CustomStackNavigators = createCustomStackNavigators(RootStack);

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
                      decoratedScreens={decoratedScreens}
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
                      decoratedScreens={decoratedScreens}
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
                      decoratedScreens={decoratedScreens}
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
                      decoratedScreens={decoratedScreens}
                    />
                  )}
                </RootStack.Screen>
              )}
              <RootStack.Screen name={NO_SCREENS} component={NoScreens} />
              <RootStack.Screen name={NO_CONTENT} component={NoContent} />
              {CustomStackNavigators}
            </RootStack.Navigator>
          )}
        </ParentStack.Screen>
        <ParentStack.Screen name={MODAL}>
          {() => <ModalNavigator decoratedScreens={decoratedScreens} />}
        </ParentStack.Screen>
      </ParentStack.Navigator>
    </>
  );
}

NavigationTree.propTypes = {
  firstShortcut: PropTypes.object,
  shortcuts: PropTypes.array,
  screens: PropTypes.object,
  hiddenShortcuts: PropTypes.array,
};
