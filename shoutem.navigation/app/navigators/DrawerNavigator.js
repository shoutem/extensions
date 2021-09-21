import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon } from '@shoutem/ui';
import { HeaderBackButton, Drawer } from '../components';
import { getRouteParams, createChildNavigators } from '../services';
import { ext } from '../const';

const DrawerStack = createDrawerNavigator();

function screenOptions(navigationProps) {
  const { isFirstScreen } = getRouteParams(navigationProps);

  return {
    headerLeft: props => {
      if (isFirstScreen) {
        // eslint-disable-next-line react/prop-types
        const { tintColor } = props;
        return (
          <Button
            styleName="clear tight"
            onPress={navigationProps.navigation.toggleDrawer}
          >
            <Icon name="sidebar" style={tintColor} />
          </Button>
        );
      }

      return <HeaderBackButton {...props} />;
    },
    headerTitleAlign: 'center',
  };
}

function Navigator({
  parentShortcut,
  hiddenShortcuts,
  decoratedScreens,
  style,
}) {
  const initialShortcutId = _.get(
    parentShortcut,
    'screens[0].settings.startingScreen',
  );

  const initialShortcut = _.find(parentShortcut.children, {
    id: initialShortcutId,
  });

  const DrawerComponents = createChildNavigators(
    parentShortcut,
    DrawerStack,
    screenOptions,
    true,
    hiddenShortcuts,
    decoratedScreens,
  );

  return (
    <DrawerStack.Navigator
      drawerType="slide"
      initialRouteName={initialShortcut?.navigationCanonicalName}
      drawerContent={props => (
        <Drawer
          parentShortcut={parentShortcut}
          hiddenShortcuts={hiddenShortcuts}
          {...props}
        />
      )}
      drawerStyle={style.menu}
    >
      {DrawerComponents}
    </DrawerStack.Navigator>
  );
}

Navigator.propTypes = {
  parentShortcut: PropTypes.object,
  hiddenShortcuts: PropTypes.array,
  decoratedScreens: PropTypes.object,
  style: PropTypes.object,
};

export const DrawerNavigator = connectStyle(ext('Drawer'))(Navigator);
