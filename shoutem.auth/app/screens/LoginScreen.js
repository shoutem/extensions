import React, { PureComponent } from 'react';
import { Alert, Platform } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Screen, ScrollView, View } from '@shoutem/ui';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import {
  BackHandlerAndroid,
  getRouteParams,
  navigateTo,
  withIsFocused,
} from 'shoutem.navigation';
import {
  AppleSignInButton,
  FacebookButton,
  HorizontalSeparator,
  LoginForm,
  RegisterButton,
  TermsAndPrivacy,
} from '../components';
import { ext } from '../const';
import { getErrorCode, getErrorMessage } from '../errorMessages';
import { ThirdPartyProviders } from '../fragments';
import { loginRequired } from '../loginRequired';
import {
  clearAuthState,
  getAccessToken,
  getUser,
  hideShortcuts,
  login,
  userAuthenticatedLimited,
  userLoggedIn,
} from '../redux';
import { authProviders } from '../services/authProviders';
import { clearSession, saveSession } from '../session';

export class LoginScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      facebookLoginInProgress: false,
      inProgress: false,
    };
  }

  componentDidMount() {
    const { clearAuthState, navigation, user } = this.props;

    BackHandlerAndroid.addListener(this.handleAndroidBackPress);

    navigation.setOptions({
      title: I18n.t(ext('logInNavBarTitle')),
    });

    if (!!user && !user.approved) {
      clearSession();
      clearAuthState();
    }
  }

  componentDidUpdate(prevProps) {
    const { user, navigation } = this.props;
    const { user: prevUser } = prevProps;

    const { routes, index } = navigation.getState();
    // Added for properly indicating focus when
    // running preview from Disclose
    const isFocused = routes[index].name === ext('LoginScreen');

    if (isFocused && _.isEmpty(prevUser.id) && !_.isEmpty(user.id)) {
      this.handleLoginSuccess();
    }
  }

  componentWillUnmount() {
    BackHandlerAndroid.removeListener(this.handleAndroidBackPress);
  }

  handleAndroidBackPress() {
    const { canGoBack } = this.props;

    if (!canGoBack && !BackHandlerAndroid.isAlertDisplayed()) {
      BackHandlerAndroid.displayAlert();
      return true;
    }

    if (!canGoBack) {
      BackHandlerAndroid.exitApp();
      return true;
    }

    return false;
  }

  handleCancel() {
    const { onCancel } = this.props;

    onCancel();
  }

  handleLoginProgressChange(inProgress) {
    this.setState({ inProgress });
  }

  handleFacebookLoginProgressChange(facebookLoginInProgress) {
    this.setState({ facebookLoginInProgress });
  }

  handlePerformLogin(username, password) {
    const { login } = this.props;

    const resolvedUsername = username.toLowerCase();

    this.handleLoginProgressChange(true);

    return login(resolvedUsername, password).catch(this.handleLoginFailed);
  }

  handleForgotPasswordPress() {
    navigateTo(ext('PasswordRecoveryScreen'));
  }

  handleLoginSuccess() {
    const {
      // eslint-disable-next-line camelcase
      access_token,
      user,
      userLoggedIn,
      hideShortcuts,
      onLoginSuccess,
      settings,
      userAuthenticatedLimited,
    } = this.props;

    if (settings.manuallyApproveMembers && !user.approved) {
      this.handleLoginProgressChange(false);

      return userAuthenticatedLimited();
    }

    userLoggedIn({
      user,
      access_token,
      callback: onLoginSuccess,
    });
    saveSession(JSON.stringify({ access_token }));
    hideShortcuts(user);

    return this.handleLoginProgressChange(false);
  }

  handleLoginFailed({ payload }) {
    const { response } = payload;

    const code = _.get(response, 'errors[0].code');
    const errorCode = getErrorCode(code);
    const errorMessage = getErrorMessage(errorCode);

    this.handleLoginProgressChange(false);
    Alert.alert(I18n.t(ext('loginFailedErrorTitle')), errorMessage);
  }

  handleRegisterPress() {
    const { onLoginSuccess } = this.props;

    navigateTo(ext('RegisterScreen'), {
      onRegisterSuccess: onLoginSuccess,
    });
  }

  render() {
    const { settings, style } = this.props;
    const { facebookLoginInProgress, inProgress } = this.state;

    const platformVersion = parseInt(Platform.Version, 10);
    const gdprSettings = _.get(settings, 'gdpr', {});
    const isEmailAuthEnabled = _.get(settings, 'providers.email.enabled');
    const isFacebookAuthEnabled = _.get(settings, 'providers.facebook.enabled');
    const isAppleAuthEnabled = _.get(settings, 'providers.apple.enabled');
    const isSignupEnabled = _.get(settings, 'signupEnabled');
    const isEligibleForAppleSignIn =
      isAppleAuthEnabled && Platform.OS === 'ios' && platformVersion >= 13;
    const { termsOfServiceLink, privacyPolicyLink } = gdprSettings;

    // As per Apple's regulation, if a user is registering a new account, terms
    // and conditions and a privacy policy must be provided. When a user signs
    // in with a third party provider for the first time, they're also creating
    // a Shoutem account, so we have to provide terms and conditions and a
    // privacy policy.
    const hasThirdPartyProviders = authProviders.hasThirdPartyProviders();

    return (
      <Screen style={style.loginScreen}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {isEmailAuthEnabled && (
            <LoginForm
              inProgress={inProgress}
              onSubmit={this.handlePerformLogin}
              onForgotPasswordPress={this.handleForgotPasswordPress}
            />
          )}

          {isEmailAuthEnabled &&
            (isEligibleForAppleSignIn || isFacebookAuthEnabled) && (
              <HorizontalSeparator />
            )}

          {isEligibleForAppleSignIn && (
            <AppleSignInButton disabled={inProgress} />
          )}
          {isFacebookAuthEnabled && (
            <FacebookButton
              disabled={inProgress || facebookLoginInProgress}
              inProgress={facebookLoginInProgress}
              onLoginProgressChange={this.handleFacebookLoginProgressChange}
              onLoginFailed={this.handleLoginFailed}
            />
          )}

          <ThirdPartyProviders />

          {isSignupEnabled && (
            <RegisterButton onPress={this.handleRegisterPress} />
          )}

          {hasThirdPartyProviders && (
            <View styleName="lg-gutter-bottom">
              <TermsAndPrivacy
                termsOfServiceLink={termsOfServiceLink}
                privacyPolicyLink={privacyPolicyLink}
              />
            </View>
          )}
        </ScrollView>
      </Screen>
    );
  }
}

LoginScreen.propTypes = {
  access_token: PropTypes.string.isRequired,
  canGoBack: PropTypes.bool.isRequired,
  clearAuthState: PropTypes.func.isRequired,
  hideShortcuts: PropTypes.func.isRequired,
  isFocused: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  settings: PropTypes.shape({
    manuallyApproveMembers: PropTypes.bool,
    providers: PropTypes.shape({
      email: PropTypes.shape({
        enabled: PropTypes.bool,
      }),
      facebook: PropTypes.shape({
        appId: PropTypes.string,
        appName: PropTypes.string,
        enabled: PropTypes.bool,
      }),
    }),
    signupEnabled: PropTypes.bool,
  }).isRequired,
  style: PropTypes.object.isRequired,
  user: PropTypes.shape({
    approved: PropTypes.bool,
    id: PropTypes.string,
  }).isRequired,
  // Dispatched with user data returned from server when user has logged in
  userAuthenticatedLimited: PropTypes.func.isRequired,
  userLoggedIn: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onLoginSuccess: PropTypes.func,
};

LoginScreen.defaultProps = { onLoginSuccess: _.noop };

const mapDispatchToProps = {
  clearAuthState,
  login,
  userLoggedIn,
  hideShortcuts,
  userAuthenticatedLimited,
};

function mapStateToProps(state, ownProps) {
  return {
    user: getUser(state),
    appId: getAppId(),
    settings: getExtensionSettings(state, ext()),
    access_token: getAccessToken(state),
    ...getRouteParams(ownProps),
  };
}

export default loginRequired(
  withIsFocused(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(connectStyle(ext('LoginScreen'))(LoginScreen)),
    false,
  ),
);
