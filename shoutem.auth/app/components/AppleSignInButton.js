import React, { PureComponent } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import autoBind from 'auto-bind';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { isPreviewApp } from 'shoutem.preview';
import { ext } from '../const';
import { getErrorCode, resolveErrorMessage } from '../errorMessages';
import { getUser, loginWithApple, registerWithApple } from '../redux';
import { resolveAppleErrorMessage } from '../services/apple';
import * as Storage from '../services/storage';

const APPLE_AUTH_OPTIONS = {
  requestedOperation: appleAuth.Operation.LOGIN,
  requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
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
    const { disabled } = this.props;
    const { inProgress } = this.state;

    if (isPreviewApp) {
      Alert.alert(
        I18n.t(ext('appleLoginPreviewTitle')),
        I18n.t(ext('appleLoginPreviewMessage')),
        [],
        { cancelable: true },
      );

      return;
    }

    if (disabled || inProgress) {
      return null;
    }

    this.setState({ inProgress: true });

    return appleAuth
      .performRequest(APPLE_AUTH_OPTIONS)
      .then(this.handleAppleAuthRequest)
      .catch(this.handleAppleAuthError)
      .finally(() => this.setState({ inProgress: false }));
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
    const { loginWithApple } = this.props;
    const { idToken } = this.state;

    if (results === appleAuth.State.AUTHORIZED) {
      return loginWithApple(idToken).catch(this.handleAppleLoginFailed);
    }

    return Alert.alert(LOGIN_ERROR_TITLE(), UNEXPECTED_ERROR());
  }

  handleAppleAuthError(error) {
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
    const { registerWithApple } = this.props;
    const { idToken } = this.state;

    Promise.all([
      Storage.getItem(firstNameStorageKey()),
      Storage.getItem(lastNameStorageKey()),
    ])
      .then(([storageFirstName, storageLastName]) =>
        registerWithApple(idToken, storageFirstName, storageLastName),
      )
      .catch(this.resolveError);
  }

  resolveError({ payload }) {
    const { response } = payload;

    const payloadErrorCode = _.get(response, 'errors[0].code');
    const resolvedErrorCode = getErrorCode(payloadErrorCode);
    const errorMessage = resolveErrorMessage(resolvedErrorCode);

    Alert.alert(LOGIN_ERROR_TITLE(), errorMessage);
  }

  render() {
    const { settings, style } = this.props;

    const darkModeEnabled = _.get(
      settings,
      'providers.apple.buttonDarkModeStyle',
      true,
    );
    const buttonStyle = darkModeEnabled
      ? AppleButton.Style.BLACK
      : AppleButton.Style.WHITE;

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
  loginWithApple: PropTypes.func.isRequired,
  registerWithApple: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

AppleSignInButton.defaultProps = {
  disabled: false,
  style: {},
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
