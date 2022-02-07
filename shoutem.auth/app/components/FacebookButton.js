import React, { PureComponent } from 'react';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, Text } from '@shoutem/ui';
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
      accessToken: null,
      inProgress: false,
    };
  }

  loginOrSignup() {
    this.setState({ inProgress: true });

    this.refreshFacebookToken()
      .then(this.parseAccessToken)
      .catch(this.openFacebookSignup)
      .finally(() => this.setState({ inProgress: false }));
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
    const { registerWithFacebook } = this.props;

    const accessToken = _.get(result, 'accessToken');

    this.setState({ accessToken });

    return fetchFacebookUserInfo(accessToken).then(results => {
      const firstName = _.get(results, 'first_name', '');
      const lastName = _.get(results, 'last_name', '');

      registerWithFacebook(accessToken, firstName, lastName).catch(
        this.handleRegistrationFailed,
      );
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
    const { loginWithFacebook, onLoginFailed } = this.props;

    return loginWithFacebook(accessToken).catch(onLoginFailed);
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
    const { disabled, style } = this.props;
    const { inProgress } = this.state;

    const resolvedInProgress = disabled || inProgress;

    return (
      <Button
        onPress={this.loginOrSignup}
        style={style.facebookButton}
        styleName="full-width inflexible"
        disabled={resolvedInProgress}
      >
        <Icon name="facebook-logo" />
        <Text allowFontScaling={false}>
          {I18n.t(ext('facebookLogInButton'))}
        </Text>
      </Button>
    );
  }
}

FacebookButton.propTypes = {
  loginWithFacebook: PropTypes.func.isRequired,
  registerWithFacebook: PropTypes.func.isRequired,
  onLoginFailed: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

FacebookButton.defaultProps = {
  disabled: false,
  style: {},
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
