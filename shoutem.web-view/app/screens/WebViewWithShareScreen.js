import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { ShareButton } from '@shoutem/ui';
import { currentLocation } from 'shoutem.cms';
import { ext } from '../const';
import { WebViewScreen } from './WebViewScreen';

export class WebViewWithShareScreen extends WebViewScreen {
  getNavBarProps() {
    const { title = '', url } = this.getSettings();

    return {
      title,
      headerRight: headerProps => (
        <ShareButton
          iconProps={{ style: headerProps.tintColor }}
          styleName="clear"
          title={title}
          url={url?.uri || url}
        />
      ),
    };
  }
}

WebViewWithShareScreen.propTypes = {
  ...WebViewScreen.propTypes,
};

WebViewWithShareScreen.defaultProps = {
  ...WebViewScreen.defaultProps,
};

export default connectStyle(ext('WebViewWithShareScreen'))(
  currentLocation(WebViewWithShareScreen),
);
