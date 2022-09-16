import React, { PureComponent } from 'react';
import { Alert } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, Spinner, Text } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { isPreviewApp } from 'shoutem.preview';
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

  handleLoginProgressChange(inProgress) {
    const { onLoginProgressChange } = this.props;

    onLoginProgressChange(inProgress);
    this.setState({ inProgress });
  }

  loginOrSignup() {
    const { onLoginProgressChange } = this.props;

    if (isPreviewApp) {
      Alert.alert(
        I18n.t(ext('facebookLoginPreviewTitle')),
        I18n.t(ext('facebookLoginPreviewMessage')),
        [],
        { cancelable: true },
      );

      return;
    }

    this.handleLoginProgressChange(true);
    this.refreshFacebookToken()
      .then(this.parseAccessToken)
      .catch(this.openFacebookSignup)
      .finally(() => {
        this.handleLoginProgressChange(true);
      });
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
        {!!inProgress && <Spinner style={style.facebookButtonSpinner} />}
        {!inProgress && (
          <>
            <Icon name="facebook-logo" style={style.facebookButtonIcon} />
            <Text allowFontScaling={false} style={style.facebookButtonText}>
              {I18n.t(ext('facebookLogInButton'))}
            </Text>
          </>
        )}
      </Button>
    );
  }
}

FacebookButton.propTypes = {
  loginWithFacebook: PropTypes.func.isRequired,
  registerWithFacebook: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
  onLoginFailed: PropTypes.func.isRequired,
  onLoginProgressChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  inProgress: PropTypes.bool,
};

FacebookButton.defaultProps = {
  disabled: false,
  inProgress: false,
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
