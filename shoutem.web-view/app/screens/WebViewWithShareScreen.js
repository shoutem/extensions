import React from 'react';
import { ShareButton } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { currentLocation } from 'shoutem.cms';
import { WebViewScreen } from './WebViewScreen';
import { ext } from '../const';

export class WebViewWithShareScreen extends WebViewScreen {
  static propTypes = {
    ...WebViewScreen.propTypes,
  };

  getNavBarProps() {
    const { title = '', url } = this.getSettings();

    return {
      title,
      headerRight: props => (
        <ShareButton
          // eslint-disable-next-line react/prop-types
          iconProps={{ style: props.tintColor }}
          styleName="clear"
          title={title}
          url={url}
        />
      ),
    };
  }
}

export default connectStyle(ext('WebViewWithShareScreen'))(
  currentLocation(WebViewWithShareScreen),
);
