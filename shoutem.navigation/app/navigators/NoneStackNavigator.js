import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { NoContent } from '../screens';
import { HeaderBackButton, HeaderTitle } from '../components';
import {
  HeaderStyles,
  createChildNavigators,
  collectShortcutScreens,
} from '../services';

const NoneStack = createStackNavigator();

const stackScreenOptions = () => {
  return {
    ...TransitionPresets.SlideFromRightIOS,
    headerLeft: props => <HeaderBackButton {...props} />,
    headerTitleAlign: 'center',
  };
};

export function NoneStackNavigator({
  parentShortcut,
  hiddenShortcuts,
  decoratedScreens,
}) {
  const initialShortcutId = _.get(
    parentShortcut,
    'screens[0].settings.startingScreen',
  );

  const initialShortcut = _.find(parentShortcut.children, {
    id: initialShortcutId,
  });

  const firstShortcut = _.isEmpty(parentShortcut.children)
    ? undefined
    : _.head(parentShortcut.children);

  const designatedShortcut = initialShortcut || firstShortcut;

  if (!designatedShortcut) {
    return (
      <NoneStack.Navigator>
        <NoneStack.Screen name={'No content'} component={NoContent} />
      </NoneStack.Navigator>
    );
  }

  const designatedShortcutScreens = _.get(designatedShortcut, 'screens');
  const firstScreenName = _.get(
    _.head(designatedShortcutScreens),
    'canonicalName',
  );

  const screens = collectShortcutScreens(designatedShortcut, decoratedScreens);

  return (
    <NoneStack.Navigator initialRouteName={firstScreenName}>
      {_.map(screens, screen => {
        const matchingShortcutScreen = _.find(designatedShortcutScreens, {
          canonicalName: screen.name,
        });
        const screenSettings = _.get(matchingShortcutScreen, 'settings', {});

        return (
          <NoneStack.Screen
            name={screen.name}
            key={screen.name}
            component={screen.component}
            options={{
              // eslint-disable-next-line react/prop-types
              headerTitle: ({ style, children }) => (
                <HeaderTitle
                  style={style}
                  shortcut={designatedShortcut}
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
                shortcut: designatedShortcut,
              }),
            }}
          />
        );
      })}
      {!_.isEmpty(designatedShortcut.children) &&
        createChildNavigators(
          designatedShortcut,
          NoneStack,
          stackScreenOptions,
          true,
          hiddenShortcuts,
          decoratedScreens,
        )}
    </NoneStack.Navigator>
  );
}

NoneStackNavigator.propTypes = {
  parentShortcut: PropTypes.object,
  hiddenShortcuts: PropTypes.array,
  decoratedScreens: PropTypes.object,
};
