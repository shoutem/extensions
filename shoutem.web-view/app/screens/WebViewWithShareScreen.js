import React from 'react';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from 'shoutem.navigation';
import { currentLocation } from 'shoutem.cms';
import { WebViewScreen } from './WebViewScreen';
import { ext } from '../const';

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
    };

    return <NavigationBar {...navBarProps} />;
  }
}

export default connectStyle(ext('WebViewWithShareScreen'))(
  currentLocation(WebViewWithShareScreen),
);
