import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Alert, Platform } from 'react-native';
import { connect } from 'react-redux';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { I18n } from 'shoutem.i18n';
import { connectStyle } from '@shoutem/theme';
import { Screen, Spinner, ScrollView, View } from '@shoutem/ui';
import HorizontalSeparator from '../components/HorizontalSeparator';
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
  getAccessToken,
  hideShortcuts,
  loginWithFacebook,
  register,
  userRegistered,
} from '../redux';
import { saveSession } from '../session';

const AUTH_ERROR = 'auth_auth_notAuthorized_userAuthenticationError';
const EMAIL_TAKEN_ERROR = 'auth_user_validation_usernameTaken';

export class RegisterScreen extends PureComponent {
  static propTypes = {
    hideShortcuts: PropTypes.func,
    loginWithFacebook: PropTypes.func,
    manualApprovalActive: PropTypes.bool,
    register: PropTypes.func,
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

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({
      title: I18n.t(ext('registerNavBarTitle')),
    });
  }

  handleRegistrationSuccess({ payload }) {
    const {
      // eslint-disable-next-line camelcase
      access_token,
      hideShortcuts,
      onRegisterSuccess,
      userRegistered,
    } = this.props;
    const createdUser = {
      id: payload.data?.id,
      userGroups: payload.data?.relationships?.userGroups?.data,
      ...payload.data?.attributes,
    };

    saveSession(JSON.stringify({ access_token }));
    userRegistered(payload);

    onRegisterSuccess(createdUser);
    hideShortcuts(createdUser);

    this.setState({ inProgress: false });
  }

  handleRegistrationFailed({ payload }) {
    const { manualApprovalActive } = this.props;
    const { response } = payload;

    this.setState({ inProgress: false });

    const code = _.get(response, 'errors[0].code');

    if (code === EMAIL_TAKEN_ERROR) {
      this.setState({ emailTaken: true });

      return;
    }

    this.setState({ emailTaken: false, email: '' });

    if (code === AUTH_ERROR && manualApprovalActive) {
      Alert.alert(
        I18n.t(ext('manualApprovalTitle')),
        I18n.t(ext('manualApprovalMessage')),
      );
    } else {
      const errorCode = getErrorCode(code);
      const errorMessage = getErrorMessage(errorCode);

      Alert.alert(I18n.t(ext('registrationFailedErrorTitle')), errorMessage);
    }
  }

  handleOpenPasswordRecoveryScreen() {
    const { email } = this.state;

    navigateTo(ext('PasswordRecoveryScreen'), { email });
  }

  performRegistration(
    email,
    username,
    password,
    gdprConsentGiven = false,
    newsletterConsentGiven = false,
  ) {
    const { register } = this.props;

    this.setState({ inProgress: true, email });
    register(
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
    const { inProgress } = this.state;

    if (inProgress) {
      return (
        <Screen>
          <Spinner styleName="xl-gutter-top" />
        </Screen>
      );
    }

    const { settings, style } = this.props;
    const { emailTaken, email } = this.state;

    const isFacebookAuthEnabled = _.get(settings, 'providers.facebook.enabled');
    const isAppleAuthEnabled = _.get(settings, 'providers.apple.enabled');
    const gdprSettings = _.get(settings, 'gdpr');
    const newsletterSettings = _.get(settings, 'newsletter');
    const { termsOfServiceLink, privacyPolicyLink } = gdprSettings;
    const platformVersion = parseInt(Platform.Version, 10);
    const isEligibleForAppleSignIn =
      isAppleAuthEnabled && Platform.OS === 'ios' && platformVersion >= 13;

    return (
      <Screen style={style.registerScreenMargin}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <RegisterForm
            email={email}
            gdprSettings={gdprSettings}
            newsletterSettings={newsletterSettings}
            emailTaken={emailTaken}
            onRecoverPasswordPress={this.handleOpenPasswordRecoveryScreen}
            onSubmit={this.performRegistration}
          />

          {(isEligibleForAppleSignIn || isFacebookAuthEnabled) && (
            <View>
              <HorizontalSeparator />
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
            </View>
          )}

          <View styleName="lg-gutter-bottom">
            <TermsAndPrivacy
              termsOfServiceLink={termsOfServiceLink}
              privacyPolicyLink={privacyPolicyLink}
            />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export const mapDispatchToProps = {
  hideShortcuts,
  loginWithFacebook,
  register,
  userRegistered,
};

export function mapStateToProps(state, ownProps) {
  return {
    user: state[ext()].user,
    appId: getAppId(),
    access_token: getAccessToken(state),
    settings: getExtensionSettings(state, ext()),
    ...getRouteParams(ownProps),
  };
}

export default loginRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('RegisterScreen'))(RegisterScreen)),
  false,
);
