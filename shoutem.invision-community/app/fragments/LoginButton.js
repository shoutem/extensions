import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { Linking } from 'react-native';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { Button, Image, Text } from '@shoutem/ui';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

export class LoginButton extends PureComponent {
  static propTypes = {
    invisionAuthorizationUrl: PropTypes.string.isRequired,
    clientId: PropTypes.string.isRequired,
    iconUrl: PropTypes.string,
    style: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  openAuthorizationSite() {
    const { invisionAuthorizationUrl, clientId } = this.props;

    const appId = getAppId();
    // Cannot use 'shoutem.' part of extension canonical name because of
    // whitelabel users.
    const redirectUri = `app${appId}://${ext().split('.')[1]}/token`;

    Linking.openURL(
      `${invisionAuthorizationUrl}?redirect_uri=${redirectUri}&response_type=token&client_id=${clientId}&scope=me`,
    );
  }

  render() {
    const { iconUrl, style } = this.props;

    return (
      <Button
        onPress={this.openAuthorizationSite}
        style={style.invisionButton}
        styleName="full-width inflexible"
      >
        {!!iconUrl && (
          <Image
            source={{ uri: iconUrl }}
            style={style.invisionButtonLogo}
            styleName="md-gutter-right"
          />
        )}
        <Text allowFontScaling={false} style={style.invisionButtonText}>
          {I18n.t(ext('invisionLoginButton'))}
        </Text>
      </Button>
    );
  }
}

export function mapStateToProps(state) {
  const settings = getExtensionSettings(state, ext());
  const { invisionAuthorizationUrl, clientId, iconUrl } = settings;

  return {
    invisionAuthorizationUrl,
    clientId,
    iconUrl,
  };
}

export default connect(mapStateToProps)(
  connectStyle(ext('LoginButton'))(LoginButton),
);
