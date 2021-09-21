import React from 'react';
import _ from 'lodash';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { appActions } from 'shoutem.application';
import { HeaderTitle, HeaderBackButton } from '../components';
import TabBarItem from '../components/TabBarItem';
import { navigateTo } from './commonActions';
import { HeaderStyles } from './createNavigationStyles';

const stackScreenOptions = () => {
  return {
    ...TransitionPresets.SlideFromRightIOS,
    headerLeft: props => <HeaderBackButton {...props} />,
    headerTitleAlign: 'center',
  };
};

function getExtensionNameByScreenName(screenName) {
  const extensionName = _.split(screenName, '.');

  return `${extensionName[0]}.${extensionName[1]}`;
}

export function collectShortcutScreens(shortcut, screens) {
  const shortcutCanonicalName = _.get(shortcut, 'canonicalName');
  const extension = getExtensionNameByScreenName(shortcutCanonicalName);

  const shortcutScreenName = _.get(shortcut, 'screens[0].canonicalName');
  const shortcutScreen = screens[shortcutScreenName];

  const resolvedShortcutScreen = shortcutScreenName
    ? { name: shortcutScreenName, component: shortcutScreen }
    : null;

  const collectedScreens = _.reduce(
    screens,
    (result, screen, name) => {
      const ownerExtension = getExtensionNameByScreenName(name);

      if (ownerExtension === extension) {
        result.push({ name, component: screen });
      }

      return result;
    },
    [],
  );

  return _.compact(
    _.uniqBy([...collectedScreens, resolvedShortcutScreen], 'name'),
  );
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
  return _.map(parentShortcut.children, shortcut => {
    const parentShortcutSettings = _.get(parentShortcut, 'screens[0].settings');
    const shortcutScreens = _.get(shortcut, 'screens');
    const firstScreenName = _.get(_.head(shortcutScreens), 'canonicalName');
    const shortcutHidden = _.includes(hiddenShortcuts, shortcut.id);

    if ((!_.isEmpty(shortcutScreens) || !!shortcut.action) && !shortcutHidden) {
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
  });
}
