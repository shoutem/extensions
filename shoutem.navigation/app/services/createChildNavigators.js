import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import _ from 'lodash';
import { appActions } from 'shoutem.application';
import { HeaderBackButton, HeaderTitle } from '../components';
import TabBarItem from '../components/TabBarItem';
import { navigationRef } from '../const';
import { HeaderStyles } from './createNavigationStyles';
import { collectShortcutScreens } from './helpers';

function stackScreenOptions() {
  return {
    ...TransitionPresets.SlideFromRightIOS,
    headerLeft: props => <HeaderBackButton {...props} />,
    headerTitleAlign: 'center',
  };
}

export function createChildNavigators(
  parentShortcut,
  Stack,
  screenOptions,
  isFolder = false,
  hiddenShortcuts,
  decoratedScreens,
  parentScreenOptions = {},
) {
  return _.compact(
    _.map(parentShortcut.children, shortcut => {
      const parentShortcutSettings = _.get(
        parentShortcut,
        'screens[0].settings',
      );
      const shortcutScreens = _.get(shortcut, 'screens');
      const firstScreenName = _.get(_.head(shortcutScreens), 'canonicalName');
      const shortcutHidden = _.includes(hiddenShortcuts, shortcut.id);

      if (
        (!_.isEmpty(shortcutScreens) || !!shortcut.action) &&
        !shortcutHidden
      ) {
        const hasChildren = !_.isEmpty(shortcut.children);
        const screens = collectShortcutScreens(shortcut, decoratedScreens);
        const ComponentStack = createStackNavigator();
        const stackName = _.get(shortcut, 'navigationCanonicalName');

        const childStack = (
          <ComponentStack.Navigator
            screenOptions={screenOptions}
            initialRouteName={firstScreenName}
          >
            {_.map(screens, screen => {
              const matchingShortcutScreen = _.find(shortcutScreens, {
                canonicalName: screen.name,
              });
              const screenSettings = _.get(
                matchingShortcutScreen,
                'settings',
                {},
              );

              return (
                <ComponentStack.Screen
                  name={screen.name}
                  key={screen.name}
                  component={screen.component}
                  options={{
                    // eslint-disable-next-line react/prop-types
                    headerTitle: ({ style, children }) => (
                      <HeaderTitle
                        style={style}
                        shortcut={shortcut}
                        title={children}
                      />
                    ),
                    ...HeaderStyles.default,
                  }}
                  initialParams={{
                    screenSettings,
                    isFirstScreen: firstScreenName === screen.name,
                    screenId: _.uniqueId(screen.name),
                    ...(firstScreenName === screen.name && {
                      shortcut,
                    }),
                  }}
                />
              );
            })}
            {hasChildren &&
              createChildNavigators(
                shortcut,
                ComponentStack,
                stackScreenOptions,
                true,
                hiddenShortcuts,
                decoratedScreens,
              )}
          </ComponentStack.Navigator>
        );

        const isAction =
          shortcut.action &&
          appActions[shortcut.action] &&
          _.isFunction(appActions[shortcut.action]);
        const action = appActions[shortcut.action];

        const onShortcutPress = isAlreadyActiveTabItem => {
          if (isAction) {
            action(shortcut);
            return;
          }

          // If user presses on tab item that is already active, we want to reset stack inside that tab, unless user
          // is already on first screen of that stack.
          // Otherwise, if user is changing between tabs, we want to keep last active stack of tab item user has pressed.
          if (isAlreadyActiveTabItem) {
            // Using native navigate, instead of our navigateTo, because navigateTo results in broken behavior, it fails
            // to resolve proper navigation params in this scenario.
            // Note that, with navigateTo, it works properly the first time user resets state of the stack, but later, if user navigates to
            // that tab again, it will always open first screen on stack, instead of last stack's state.
            navigationRef.current?.navigate(stackName, {
              screen: firstScreenName,
              params: {},
            });
          } else {
            navigationRef.current?.navigate(stackName);
          }
        };

        return (
          <Stack.Screen
            name={stackName}
            key={stackName}
            options={{
              // eslint-disable-next-line react/prop-types
              headerTitle: ({ style, children }) => (
                <HeaderTitle
                  style={style}
                  shortcut={parentShortcut}
                  title={children}
                />
              ),
              headerShown: !isFolder,
              tabBarButton: props => (
                <TabBarItem
                  {...parentShortcutSettings}
                  {...props}
                  onPress={() => {
                    onShortcutPress(props.accessibilityState.selected);
                  }}
                  shortcut={shortcut}
                  // eslint-disable-next-line react/prop-types
                  selected={props.accessibilityState.selected}
                />
              ),
              ...parentScreenOptions,
            }}
          >
            {() => childStack}
          </Stack.Screen>
        );
      }

      return null;
    }),
  );
}
