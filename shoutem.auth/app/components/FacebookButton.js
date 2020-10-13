import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBind from 'auto-bind';
import { connect } from 'react-redux';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { View, Button, Icon, Text } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { errorMessages } from '../errorMessages';
import {
  fetchFacebookUserInfo,
  loginWithFacebook,
  registerWithFacebook,
} from '../redux';

class FacebookButton extends PureComponent {
  constructor(props) {
    super(props);

    autoBind(this);

    this.state = {
      accesssToken: null,
    };
  }

  loginOrSignup() {
    this.refreshFacebookToken()
      .then(this.parseAccessToken)
      .catch(this.openFacebookSignup);
  }

  parseAccessToken(result) {
    const accessToken = _.get(result, 'accessToken');

    if (!accessToken) {
      throw new Error(I18n.t(ext('tokenErrorMessage')));
    }

    this.setState({ accessToken });
    return this.handleFacebookLogin();
  }

  handleFacebookRegistration(result) {
    const { onLoginSuccess, registerWithFacebook } = this.props;

    const accessToken = _.get(result, 'accessToken');

    this.setState({ accessToken });

    return fetchFacebookUserInfo(accessToken).then((results) => {
      const firstName = _.get(results, 'first_name', '');
      const lastName = _.get(results, 'last_name', '');

      registerWithFacebook(accessToken, firstName, lastName)
        .then(onLoginSuccess)
        .catch(this.handleRegistrationFailed);
    });
  }

  openFacebookSignup() {
    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then(this.handleSignupResult)
      .then(this.handleFacebookRegistration)
      .catch(this.handleLoginFailed);
  }

  refreshFacebookToken() {
    return AccessToken.refreshCurrentAccessTokenAsync().then(
      AccessToken.getCurrentAccessToken,
    );
  }

  handleSignupResult(result) {
    if (result.isCancelled) {
      throw new Error(I18n.t(ext('loginCancelErrorMessage')));
    }

    return AccessToken.getCurrentAccessToken();
  }

  handleLoginFailed(error) {
    const { onLoginFailed } = this.props;

    const errorMessage = error.message || errorMessages.UNEXPECTED_ERROR;
    onLoginFailed(errorMessage);
  }

  handleFacebookLogin() {
    const { accessToken } = this.state;
    const { loginWithFacebook, onLoginSuccess, onLoginFailed } = this.props;

    return loginWithFacebook(accessToken)
      .then(onLoginSuccess)
      .catch(onLoginFailed);
  }

  handleRegistrationFailed(error) {
    const { onLoginFailed } = this.props;

    const errorStatus = _.get(error, 'payload.status', '');

    /* We want to allow users who were once logged in using Facebook and then deleted/reinstalled the app to be able to log in again. */
    if (errorStatus === 409) {
      return this.handleFacebookLogin();
    }

    return onLoginFailed(error);
  }

  render() {
    const { style } = this.props;

    return (
      <View>
        <Button
          onPress={this.loginOrSignup}
          style={style.facebookButton}
          styleName="full-width inflexible"
        >
          <Icon name="facebook-logo" />
          <Text allowFontScaling={false}>
            {I18n.t(ext('facebookLogInButton'))}
          </Text>
        </Button>
      </View>
    );
  }
}

FacebookButton.propTypes = {
  onLoginSuccess: PropTypes.func,
  onLoginFailed: PropTypes.func,
  loginWithFacebook: PropTypes.func,
  registerWithFacebook: PropTypes.func,
  style: PropTypes.object,
};

const mapDispatchToProps = {
  loginWithFacebook,
  registerWithFacebook,
};

function mapStateToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('FacebookButton'))(FacebookButton));
