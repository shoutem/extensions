import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import i18next from 'i18next';
import {
  SettingsPageRenderer,
  ExtensionContextProvider,
} from '@shoutem/web-core';
import { translateExt18n } from '../../services';
import Screen from './Screen';
import LOCALIZATION from './localization';

export default class ScreenGroup extends Component {
  constructor(props) {
    super(props);
    this.handleLayoutSettingsPageError = this.handleLayoutSettingsPageError.bind(
      this,
    );
  }

  handleLayoutSettingsPageError() {
    // do nothing, layout settings page is optional
    return null;
  }

  render() {
    const {
      extensionName,
      originalScreen,
      activeScreenDescriptor,
      onScreenSelected,
      shortcutId,
    } = this.props;
    const { alternativeScreens } = originalScreen;

    const title =
      translateExt18n(extensionName, _.get(originalScreen, 'groupTitle')) ||
      i18next.t(LOCALIZATION.DEFAULT_GROUP_TITLE);

    const activeScreenCanonicalName = _.get(
      activeScreenDescriptor,
      'canonicalName',
    );

    const alternativeScreen = _.find(alternativeScreens, [
      'canonicalName',
      activeScreenCanonicalName,
    ]);
    const activeScreen = alternativeScreen || originalScreen;

    const scope = {
      shortcutId,
      screenDescriptor: activeScreenDescriptor,
    };

    return (
      <div className="screen_group">
        <span className="screen_group__title">{title}</span>
        <div className="screen_group__screen-list">
          <Screen
            extensionName={extensionName}
            screen={originalScreen}
            isActive={originalScreen === activeScreen}
            onClick={onScreenSelected}
          />
          {alternativeScreens.map(screen => (
            <Screen
              key={screen.id}
              extensionName={extensionName}
              screen={screen}
              isActive={screen === activeScreen}
              onClick={onScreenSelected}
            />
          ))}
        </div>
        <div className="screen_group__settings">
          {activeScreen && activeScreen.settingsPage && (
            <ExtensionContextProvider
              key={activeScreen.settingsPage.page}
              context={{ screenDescriptor: activeScreenDescriptor }}
            >
              <SettingsPageRenderer
                key={activeScreen.settingsPage.page}
                settingsPageId={activeScreen.settingsPage.page}
                scope={scope}
                onError={this.handleLayoutSettingsPageError}
              />
            </ExtensionContextProvider>
          )}
        </div>
        <div className="screen_group__clear" />
      </div>
    );
  }
}

ScreenGroup.propTypes = {
  extensionName: PropTypes.string,
  originalScreen: PropTypes.object,
  activeScreenDescriptor: PropTypes.object,
  shortcutId: PropTypes.string,
  onScreenSelected: PropTypes.func,
};
