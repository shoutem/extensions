import React from 'react';
import _ from 'lodash';
import { I18n, LocalizationContext } from 'shoutem.i18n';
import { Title, View } from '@shoutem/ui';
import { NavigationBar } from '../NavigationBar';

function hasBackgroundImage(navBarProps) {
  return (NavigationBar.globalNavigationBarImage || navBarProps.navigationBarImage);
}

/**
 * Check if title should be displayed or now
 * @param {bool} showTitle
 */
function canShowTitle(navBarProps) {
  if (!hasBackgroundImage(navBarProps)) {
    return true;
  } else if (NavigationBar.showTitle === false) {
    return false;
  }

  return NavigationBar.showTitle;
}

const createTitle = navBarProps => () => {
  return <LocalizationContext.Consumer>
    {() => {
      const shortcutId = _.get(navBarProps, 'scene.route.props.shortcut.id');
      const title = I18n.t(`shoutem.navigation.shortcuts.${shortcutId}`, {
        defaultValue: navBarProps.title,
      });

      return (
        <View virtual styleName="container">
          <Title animationName={navBarProps.animationName} numberOfLines={1}>
            {title}
          </Title>
        </View>
      );
    }}
  </LocalizationContext.Consumer>
};

const TitleComposer = {
  canCompose(navBarProps) {
    const value = navBarProps.title;
    return (!!value && canShowTitle(navBarProps));
  },
  compose(navBarProps) {
    return {
      renderTitleComponent: createTitle(navBarProps),
    };
  },
};

export default TitleComposer;
