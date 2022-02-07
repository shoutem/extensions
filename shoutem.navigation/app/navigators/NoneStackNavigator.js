import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { I18n } from 'shoutem.i18n';
import { HeaderBackButton, HeaderTitle } from '../components';
import { ext } from '../const';
import { NoContent } from '../screens';
import {
  collectShortcutScreens,
  createChildNavigators,
  HeaderStyles,
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
  screens,
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
        <NoneStack.Screen
          name={I18n.t(ext('noContentScreenName'))}
          component={NoContent}
        />
      </NoneStack.Navigator>
    );
  }

  const designatedShortcutScreens = _.get(designatedShortcut, 'screens');
  const firstScreenName = _.get(
    _.head(designatedShortcutScreens),
    'canonicalName',
  );

  const shortcutScreens = collectShortcutScreens(designatedShortcut, screens);

  return (
    <NoneStack.Navigator initialRouteName={firstScreenName}>
      {_.map(shortcutScreens, screen => {
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
          screens,
        )}
    </NoneStack.Navigator>
  );
}

NoneStackNavigator.propTypes = {
  hiddenShortcuts: PropTypes.array.isRequired,
  parentShortcut: PropTypes.object.isRequired,
  screens: PropTypes.object.isRequired,
};
