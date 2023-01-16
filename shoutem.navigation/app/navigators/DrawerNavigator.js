import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon } from '@shoutem/ui';
import { Drawer, HeaderBackButton } from '../components';
import { ext, NO_SCREENS } from '../const';
import NoScreens from '../screens/NoScreens';
import { createChildNavigators, getRouteParams } from '../services';
import { createCustomStackNavigators } from './CustomStackNavigators';

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

function customStackScreenOptions(navigationProps) {
  const parentState = navigationProps.navigation.getParent().getState();
  const { isFirstScreen, previousRoute, onBack } = getRouteParams(
    navigationProps,
  );

  const prevRouteContainedInDrawer = _.find(parentState.routes, route => {
    if (_.get(route, 'params.screen') === previousRoute.name) {
      return true;
    }
    return false;
  });

  const prevPreviousRoute = _.get(previousRoute, 'params.previousRoute');
  const isFromRootShortcut =
    !prevPreviousRoute ||
    (parentState.type === 'drawer' && prevRouteContainedInDrawer);

  return {
    headerLeft: props => {
      if (isFirstScreen && isFromRootShortcut) {
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

      // Mostly, we want to control the visibility of the drawer icon in the top left
      // This causes a few issues with the custom navigator screen options that have custom
      // headerLeft implementation, as these have presedence when resolving screenOptions.
      // For this purpose, we include onBack route prop,
      // which will be used by any form of backbutton enforced by parent navigator like
      // Drawer or TabBar
      const defaultBackHandler = onBack || navigationProps.navigation.goBack;

      return <HeaderBackButton {...props} onPress={defaultBackHandler} />;
    },
    headerTitleAlign: 'center',
  };
}

function Navigator({ parentShortcut, hiddenShortcuts, screens, style }) {
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
    screens,
  );

  const NoScreensComponent = (
    <DrawerStack.Screen name={NO_SCREENS} component={NoScreens} />
  );
  const CustomNavigators = createCustomStackNavigators(DrawerStack, {
    screenOptions: customStackScreenOptions,
  });

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
      {[...DrawerComponents, ...CustomNavigators, NoScreensComponent]}
    </DrawerStack.Navigator>
  );
}

Navigator.propTypes = {
  parentShortcut: PropTypes.object.isRequired,
  screens: PropTypes.object.isRequired,
  hiddenShortcuts: PropTypes.array,
  style: PropTypes.object,
};

Navigator.defaultProps = {
  hiddenShortcuts: [],
  style: {},
};

export const DrawerNavigator = connectStyle(ext('Drawer'))(Navigator);
