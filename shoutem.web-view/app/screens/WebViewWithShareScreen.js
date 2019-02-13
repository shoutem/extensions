import React from 'react';
import _ from 'lodash';
import { NavigationBar } from '@shoutem/ui/navigation';
import { currentLocation } from 'shoutem.cms';
import WebViewScreen from './WebViewScreen';

export class WebViewWithShareScreen extends WebViewScreen {
  static propTypes = {
    ...WebViewScreen.propTypes,
  };

  renderNavigationBar() {
    const { title } = this.props;
    const { url } = this.getSettings();

    const navBarProps = {
      ...this.getNavBarProps(),
      share: {
        title,
        link: url,
      },
    }

    return (
      <NavigationBar
        {...navBarProps}
      />
    );
  }
}

export default currentLocation(WebViewWithShareScreen);
