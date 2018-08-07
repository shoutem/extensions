import React from 'react';
import _ from 'lodash';
import { NavigationBar } from '@shoutem/ui/navigation';
import WebViewScreen from './WebViewScreen';

export default class WebViewWithShareScreen extends WebViewScreen {
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
