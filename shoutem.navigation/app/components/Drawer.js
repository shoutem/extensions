import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { appActions } from 'shoutem.application';
import { getCurrentRoute, navigateTo } from '../services';
import DrawerItem from './DrawerItem';

export function Drawer(props) {
  const { parentShortcut, hiddenShortcuts, ...otherProps } = props;

  const itemSettings = _.get(parentShortcut, 'screens[0].settings', {});
  const currentRouteName = _.get(
    getCurrentRoute(),
    'params.shortcut.navigationCanonicalName',
  );

  return (
    <DrawerContentScrollView {...otherProps}>
      {_.map(parentShortcut.children, child => {
        if (_.includes(hiddenShortcuts, child.id)) {
          return null;
        }

        const isAction =
          child.action &&
          appActions[child.action] &&
          _.isFunction(appActions[child.action]);
        const action = appActions[child.action];
        const onShortcutPress = isAction
          ? () => action(child)
          : () =>
              navigateTo(child.navigationCanonicalName, {
                screen: _.get(child, 'screens[0].canonicalName'),
                params: {},
              });

        return (
          <DrawerItem
            key={child.navigationCanonicalName}
            shortcut={child}
            {...itemSettings}
            selected={currentRouteName === child.navigationCanonicalName}
            onPress={onShortcutPress}
          />
        );
      })}
    </DrawerContentScrollView>
  );
}

Drawer.propTypes = {
  parentShortcut: PropTypes.object,
  hiddenShortcuts: PropTypes.array,
};
