import React from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { appActions } from 'shoutem.application';
import { isWeb } from 'shoutem-core';
import { ext } from '../const';
import { getCurrentRoute, navigateTo } from '../services';
import DrawerItem from './DrawerItem';

const DrawerScrollContainer = props => {
  const { parentShortcut, hiddenShortcuts, style, ...otherProps } = props;

  const itemSettings = _.get(parentShortcut, 'screens[0].settings', {});
  const currentRouteName = _.get(
    getCurrentRoute(),
    'params.shortcut.navigationCanonicalName',
  );

  const resolvedStyle = isWeb ? { style: style.container } : undefined;

  return (
    <DrawerContentScrollView {...otherProps} {...resolvedStyle}>
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
};

DrawerScrollContainer.propTypes = {
  style: PropTypes.object.isRequired,
  hiddenShortcuts: PropTypes.array,
  parentShortcut: PropTypes.object,
};

DrawerScrollContainer.defaultProps = {
  hiddenShortcuts: [],
  parentShortcut: {},
};

export const Drawer = connectStyle(ext('DrawerScrollContainer'))(
  DrawerScrollContainer,
);
