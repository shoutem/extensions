import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Alert, Platform } from 'react-native';
import { connect } from 'react-redux';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { NavigationBar, navigateTo } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import { Screen, Spinner, ScrollView } from '@shoutem/ui';
import {
  RegisterForm,
  AppleSignInButton,
  FacebookButton,
  TermsAndPrivacy,
} from '../components';
import { ext } from '../const';
import { getErrorCode, getErrorMessage } from '../errorMessages';
import { loginRequired } from '../loginRequired';
import {
  register,
  userRegistered,
  getAccessToken,
  loginWithFacebook,
} from '../redux';
import { saveSession } from '../session';
import HorizontalSeparator from '../components/HorizontalSeparator';

const AUTH_ERROR = 'auth_auth_notAuthorized_userAuthenticationError';
const EMAIL_TAKEN_ERROR = 'auth_user_validation_usernameTaken';

export class RegisterScreen extends PureComponent {
  static propTypes = {
    register: PropTypes.func,
    manualApprovalActive: PropTypes.bool,
    loginWithFacebook: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      inProgress: false,
      emailTaken: false,
      email: '',
    };
  }

  handleRegistrationSuccess({ payload }) {
    // eslint-disable-next-line camelcase
    const { access_token, onRegisterSuccess, userRegistered } = this.props;
    const createdUser = { id: payload?.data?.id, ...payload?.data?.attributes };

    saveSession(JSON.stringify({ access_token }));
    userRegistered(payload);

    onRegisterSuccess(createdUser);

    this.setState({ inProgress: false });
  }

  handleRegistrationFailed({ payload }) {
    const { manualApprovalActive } = this.props;
    const { response } = payload;

    this.setState({ inProgress: false });

    const code = _.get(response, 'errors[0].code');
    const errorCode = getErrorCode(code);
    const errorMessage = getErrorMessage(errorCode);

    if (code === EMAIL_TAKEN_ERROR) {
      this.setState({
        emailTaken: true,
      });

      return;
    }

    this.setState({
      emailTaken: false,
      email: '',
    });

    if (code === AUTH_ERROR && manualApprovalActive) {
      Alert.alert(
        I18n.t(ext('manualApprovalTitle')),
        I18n.t(ext('manualApprovalMessage')),
      );
    } else {
      Alert.alert(I18n.t(ext('registrationFailedErrorTitle')), errorMessage);
    }
  }

  handleOpenPasswordRecoveryScreen() {
    const { email } = this.state;
    const { navigateTo, navigateToLoginScreen } = this.props;

    const route = {
      screen: ext('PasswordRecoveryScreen'),
      props: {
        email,
        navigateToLoginScreen,
      },
    };

    navigateTo(route);
  }

  performRegistration(
    email,
    username,
    password,
    gdprConsentGiven = false,
    newsletterConsentGiven = false,
  ) {
    this.setState({ inProgress: true, email });

    this.props
      .register(
        email,
        username,
        password,
        gdprConsentGiven,
        newsletterConsentGiven,
      )
      .then(this.handleRegistrationSuccess)
      .catch(this.handleRegistrationFailed);
  }

  render() {
    const { emailTaken, inProgress, email } = this.state;
    const { settings, style } = this.props;

    const isFacebookAuthEnabled = _.get(settings, 'providers.facebook.enabled');
    const isAppleAuthEnabled = _.get(settings, 'providers.apple.enabled');
    const gdprSettings = _.get(settings, 'gdpr');
    const newsletterSettings = _.get(settings, 'newsletter');
    const { termsOfServiceLink, privacyPolicyLink } = gdprSettings;
    const platformVersion = parseInt(Platform.Version, 10);
    const isEligibleForAppleSignIn =
      isAppleAuthEnabled && Platform.OS === 'ios' && platformVersion >= 13;

    if (inProgress) {
      return (
        <Screen>
          <NavigationBar title={I18n.t(ext('registerNavBarTitle'))} />
          <Spinner styleName="xl-gutter-top" />
        </Screen>
      );
    }

    return (
      <Screen style={style.registerScreenMargin}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <NavigationBar title={I18n.t(ext('registerNavBarTitle'))} />
          <RegisterForm
            email={email}
            gdprSettings={gdprSettings}
            newsletterSettings={newsletterSettings}
            emailTaken={emailTaken}
            onRecoverPasswordPress={this.handleOpenPasswordRecoveryScreen}
            onSubmit={this.performRegistration}
          />

          {(isEligibleForAppleSignIn || isFacebookAuthEnabled) && (
            <HorizontalSeparator />
          )}

          {isEligibleForAppleSignIn && (
            <AppleSignInButton
              onLoginFailed={this.handleRegistrationFailed}
              onLoginSuccess={this.handleRegistrationSuccess}
            />
          )}

          {isFacebookAuthEnabled && (
            <FacebookButton
              onLoginFailed={this.handleRegistrationFailed}
              onLoginSuccess={this.handleRegistrationSuccess}
            />
          )}
          <TermsAndPrivacy
            termsOfServiceLink={termsOfServiceLink}
            privacyPolicyLink={privacyPolicyLink}
          />
        </ScrollView>
      </Screen>
    );
  }
}

export const mapDispatchToProps = {
  register,
  userRegistered,
  loginWithFacebook,
  navigateTo,
};

function mapStateToProps(state) {
  return {
    user: state[ext()].user,
    appId: getAppId(),
    access_token: getAccessToken(state),
    settings: getExtensionSettings(state, ext()),
  };
}

export default loginRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('RegisterScreen'))(RegisterScreen)),
  false,
);
