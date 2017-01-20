import React, { Component, PropTypes} from 'react';
import _ from 'lodash';
import Screen from './Screen';
import { AdminPageRenderer, ExtensionContextProvider } from '@shoutem/web-core';

export default class ScreenGroup extends Component {
  constructor(props) {
    super(props);
    this.handleLayoutSettingsPageError = this.handleLayoutSettingsPageError.bind(this);
  }

  handleLayoutSettingsPageError() {
    // do nothing, layout settings page is optional
    return null;
  }

  render() {
    const { originalScreen, activeScreenDescriptor, onScreenSelected } = this.props;
    const { alternativeScreens } = originalScreen;

    if (!alternativeScreens || alternativeScreens.length === 0) {
      // do not show this group if there are no alternative screens
      return null;
    }

    const alternativeScreen = _.find(alternativeScreens, [
      'canonicalName',
      activeScreenDescriptor.canonicalName,
    ]);
    const activeScreen = alternativeScreen || originalScreen;

    return (
      <div className="screen_group">
        <span className="screen_group__title">
          Choose layout
        </span>
        <div className="screen_group__screen-list">
          <Screen
            screen={originalScreen}
            isActive={originalScreen === activeScreen}
            onClick={onScreenSelected}
          />
          {alternativeScreens.map(alternativeScreen => (
            <Screen
              key={alternativeScreen.id}
              screen={alternativeScreen}
              isActive={alternativeScreen === activeScreen}
              onClick={onScreenSelected}
            />
          ))}
          {activeScreen && activeScreen.settingsPage && (
            <ExtensionContextProvider
              key={activeScreen.settingsPage.page}
              context={{ screenDescriptor: activeScreenDescriptor }}
            >
              <AdminPageRenderer
                key={activeScreen.settingsPage.page}
                adminPageId={activeScreen.settingsPage.page}
                onError={this.handleLayoutSettingsPageError}
              />
            </ExtensionContextProvider>
          )}
          <div className="screen_group__clear"></div>
        </div>
      </div>
    );
  }
}


ScreenGroup.propTypes = {
  originalScreen: PropTypes.object,
  activeScreenDescriptor: PropTypes.object,
  onScreenSelected: PropTypes.func,
};
