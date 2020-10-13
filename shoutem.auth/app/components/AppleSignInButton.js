import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBind from 'auto-bind';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';
import { connectStyle } from '@shoutem/theme';
import { View, Spinner } from '@shoutem/ui';
import { getExtensionSettings, getAppId } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { getUser, loginWithApple, registerWithApple } from '../redux';
import * as Storage from '../services/storage';
import { resolveAppleErrorMessage } from '../services/apple';
import { getErrorCode, resolveErrorMessage } from '../errorMessages';
import { ext } from '../const';

const APPLE_AUTH_OPTIONS = {
  requestedOperation: appleAuth.Operation.LOGIN,
  requestedScopes: [
    appleAuth.Scope.EMAIL,
    appleAuth.Scope.FULL_NAME,
  ],
};
const LOGIN_ERROR_TITLE = () => I18n.t(ext('loginFailedErrorTitle'));
const UNEXPECTED_ERROR = () =>
  I18n.t('shoutem.application.unexpectedErrorMessage');

function firstNameStorageKey() {
  return `app-${getAppId()}:${ext()}.firstName`;
}

function lastNameStorageKey() {
  return `app-${getAppId()}:${ext()}.lastName`;
}

class AppleSignInButton extends PureComponent {
  constructor(props) {
    super(props);

    autoBind(this);

    this.state = {
      idToken: null,
      inProgress: false,
    };
  }

  handleAppleButtonPress() {
    this.setState({ inProgress: true });

    return appleAuth
      .performRequest(APPLE_AUTH_OPTIONS)
      .then(this.handleAppleAuthRequest)
      .catch(this.handleAppleAuthError);
  }

  handleAppleAuthRequest(results) {
    const { user, identityToken, fullName } = results;

    this.setState({ idToken: identityToken });

    const firstName = _.get(fullName, 'givenName');
    const lastName = _.get(fullName, 'familyName');

    Storage.saveItem(firstNameStorageKey(), firstName);
    Storage.saveItem(lastNameStorageKey(), lastName);

    appleAuth
      .getCredentialStateForUser(user)
      .then(this.handleAppleLoginRequest)
      .catch(this.handleAppleAuthError);
  }

  handleAppleLoginRequest(results) {
    const { loginWithApple, onLoginSuccess } = this.props;
    const { idToken } = this.state;

    if (results === appleAuth.State.AUTHORIZED) {
      return loginWithApple(idToken)
        .then(onLoginSuccess)
        .catch(this.handleAppleLoginFailed);
    }

    return Alert.alert(LOGIN_ERROR_TITLE(), UNEXPECTED_ERROR());
  }

  handleAppleAuthError(error) {
    this.setState({ inProgress: false });

    const errorCode = _.get(error, 'code');
    const resolvedMessage = resolveAppleErrorMessage(errorCode);

    Alert.alert(LOGIN_ERROR_TITLE(), resolvedMessage);
  }

  handleAppleLoginFailed({ payload }) {
    const errorStatus = _.get(payload, 'status');

    if (errorStatus === 401) {
      return this.performAppleRegistration();
    }
    return this.resolveError({ payload });
  }

  performAppleRegistration() {
    const { onLoginSuccess, registerWithApple } = this.props;
    const { idToken } = this.state;

    Promise.all([
      Storage.getItem(firstNameStorageKey()),
      Storage.getItem(lastNameStorageKey()),
    ])
      .then(([storageFirstName, storageLastName]) =>
        registerWithApple(idToken, storageFirstName, storageLastName),
      )
      .then(onLoginSuccess)
      .catch(this.resolveError);
  }

  resolveError({ payload }) {
    this.setState({ inProgress: false });

    const { response } = payload;

    const payloadErrorCode = _.get(response, 'errors[0].code');
    const resolvedErrorCode = getErrorCode(payloadErrorCode);
    const errorMessage = resolveErrorMessage(resolvedErrorCode);

    Alert.alert(LOGIN_ERROR_TITLE(), errorMessage);
  }

  render() {
    const { inProgress } = this.state;
    const { settings, style } = this.props;

    const darkModeEnabled = _.get(
      settings,
      'providers.apple.buttonDarkModeStyle',
      true,
    );
    const buttonStyle = darkModeEnabled
      ? AppleButton.Style.BLACK
      : AppleButton.Style.WHITE;

    if (inProgress) {
      return (
        <View>
          <Spinner styleName="xl-gutter-top" />
        </View>
      );
    }

    return (
      <AppleButton
        buttonStyle={buttonStyle}
        buttonType={AppleButton.Type.SIGN_IN}
        onPress={this.handleAppleButtonPress}
        style={style.appleButton}
      />
    );
  }
}

AppleSignInButton.propTypes = {
  onLoginSuccess: PropTypes.func,
  settings: PropTypes.object,
  style: PropTypes.object,
};

const mapDispatchToProps = {
  registerWithApple,
  loginWithApple,
};

function mapStateToProps(state) {
  return {
    user: getUser(state),
    settings: getExtensionSettings(state, ext()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('AppleSignInButton'))(AppleSignInButton));
