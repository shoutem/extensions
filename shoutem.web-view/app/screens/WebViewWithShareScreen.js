import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { ShareButton } from '@shoutem/ui';
import { currentLocation } from 'shoutem.cms';
import { ext } from '../const';
import { WebViewScreen } from './WebViewScreen';
import { connect } from 'react-redux';
import { mapDispatchToProps } from './WebViewScreen';
import { getRouteParams } from 'shoutem.navigation';

export class WebViewWithShareScreen extends WebViewScreen {
  getNavBarProps() {
    const { title = '', url } = this.getSettings();

    // showScreenTitle was implemented recently and default value is true.
    // We should only hide header title if app owner explicitly disabled the option
    // and republished the app.
    const resolvedTitle =
      getRouteParams(this.props).shortcut.settings.showScreenTitle === false
        ? ''
        : title;

    return {
      title: resolvedTitle,
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

export default connect(
  null,
  mapDispatchToProps,
)(
  connectStyle(ext('WebViewWithShareScreen'))(
    currentLocation(WebViewWithShareScreen),
  ),
);
