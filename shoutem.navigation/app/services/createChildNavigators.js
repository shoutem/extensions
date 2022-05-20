import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import _ from 'lodash';
import { appActions } from 'shoutem.application';
import { HeaderBackButton, HeaderTitle } from '../components';
import TabBarItem from '../components/TabBarItem';
import { navigateTo } from './commonActions';
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
        const onShortcutPress = isAction
          ? () => action(shortcut)
          : () =>
              navigateTo(stackName, {
                screen: firstScreenName,
                params: {},
              });

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
                  onPress={onShortcutPress}
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
