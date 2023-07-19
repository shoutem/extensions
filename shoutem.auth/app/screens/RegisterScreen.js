import React, { PureComponent } from 'react';
import { Alert, Platform } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Screen, ScrollView, View } from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, goBack, navigateTo } from 'shoutem.navigation';
import {
  AppleSignInButton,
  FacebookButton,
  RegisterForm,
  TermsAndPrivacy,
} from '../components';
import HorizontalSeparator from '../components/HorizontalSeparator';
import { ext } from '../const';
import { getErrorCode, getErrorMessage } from '../errorMessages';
import { loginRequired } from '../loginRequired';
import {
  getAccessToken,
  hideShortcuts,
  register,
  userAuthenticatedLimited,
  userRegistered,
} from '../redux';
import { saveSession } from '../session';

const EMAIL_TAKEN_ERROR = 'auth_user_validation_usernameTaken';

export class RegisterScreen extends PureComponent {
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
      userAuthenticatedLimited,
      userRegistered,
    } = this.props;
    const createdUser = {
      id: payload.data?.id,
      userGroups: payload.data?.relationships?.userGroups?.data,
      ...payload.data?.attributes,
    };

    if (!createdUser.approved) {
      this.setState({ inProgress: false });

      return userAuthenticatedLimited(goBack);
    }

    return userRegistered({
      user: createdUser,
      access_token,
      callback: onRegisterSuccess,
    })
      .then(() => {
        saveSession(JSON.stringify({ access_token }));
        hideShortcuts(createdUser);
      })
      .finally(() => this.setState({ inProgress: false }));
  }

  handleRegistrationFailed({ payload }) {
    const { response } = payload;

    this.setState({ inProgress: false });

    const code = _.get(response, 'errors[0].code');

    if (code === EMAIL_TAKEN_ERROR) {
      this.setState({ emailTaken: true });

      return null;
    }

    this.setState({ emailTaken: false, email: '' });

    const errorCode = getErrorCode(code);
    const errorMessage = getErrorMessage(errorCode);

    return Alert.alert(
      I18n.t(ext('registrationFailedErrorTitle')),
      errorMessage,
    );
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
      <Screen style={style.registerScreen}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <RegisterForm
            email={email}
            gdprSettings={gdprSettings}
            inProgress={inProgress}
            newsletterSettings={newsletterSettings}
            emailTaken={emailTaken}
            onRecoverPasswordPress={this.handleOpenPasswordRecoveryScreen}
            onSubmit={this.performRegistration}
          />

          {(isEligibleForAppleSignIn || isFacebookAuthEnabled) && (
            <View>
              <HorizontalSeparator />
              {isEligibleForAppleSignIn && (
                <AppleSignInButton disabled={inProgress} />
              )}
              {isFacebookAuthEnabled && (
                <FacebookButton
                  disabled={inProgress}
                  onLoginFailed={this.handleRegistrationFailed}
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

RegisterScreen.propTypes = {
  access_token: PropTypes.string.isRequired,
  hideShortcuts: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  userAuthenticatedLimited: PropTypes.func.isRequired,
  userRegistered: PropTypes.func.isRequired,
  onRegisterSuccess: PropTypes.func,
};

RegisterScreen.defaultProps = {
  onRegisterSuccess: _.noop(),
};

export const mapDispatchToProps = {
  hideShortcuts,
  register,
  userAuthenticatedLimited,
  userRegistered,
};

export function mapStateToProps(state, ownProps) {
  return {
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
