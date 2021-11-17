import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Alert, InteractionManager, Platform } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import {
  getRouteParams,
  HeaderBackButton,
  navigateTo,
} from 'shoutem.navigation';
import { I18n } from 'shoutem.i18n';
import { connectStyle } from '@shoutem/theme';
import { Screen, ScrollView, Spinner, View } from '@shoutem/ui';
import { authProviders } from '../services/authProviders';
import {
  AppleSignInButton,
  FacebookButton,
  HorizontalSeparator,
  LoginForm,
  RegisterButton,
  TermsAndPrivacy,
} from '../components';
import { ext } from '../const';
import { ThirdPartyProviders } from '../fragments';
import { getErrorCode, getErrorMessage } from '../errorMessages';
import { loginRequired } from '../loginRequired';
import {
  login,
  isAuthenticated,
  userLoggedIn,
  getUser,
  getAccessToken,
  hideShortcuts,
} from '../redux';
import { saveSession } from '../session';

export class LoginScreen extends PureComponent {
  static propTypes = {
    login: PropTypes.func,
    loginWithFacebook: PropTypes.func,
    isUserAuthenticated: PropTypes.bool,
    inProgress: PropTypes.bool,
    onLoginSuccess: PropTypes.func,
    isAuthenticated: PropTypes.bool,
    hideShortcuts: PropTypes.func,
    user: PropTypes.shape({
      id: PropTypes.string,
    }),
    access_token: PropTypes.string,
    settings: PropTypes.shape({
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
    }),
    // Dispatched with user data returned from server when user has logged in
    userLoggedIn: PropTypes.func,
  };

  static defaultPropTypes = { onLoginSuccess: _.noop };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = { inProgress: false };
  }

  componentDidMount() {
    const { navigation, canGoBack } = this.props;

    navigation.setOptions({
      title: I18n.t(ext('logInNavBarTitle')),
      headerLeft: canGoBack
        ? props => <HeaderBackButton {...props} onPress={this.handleCancel} />
        : null,
    });
  }

  componentDidUpdate() {
    const { user } = this.props;

    if (user && user?.id) {
      const { hideShortcuts, onLoginSuccess } = this.props;

      hideShortcuts(user);
      onLoginSuccess(user);
    }
  }

  handleCancel() {
    const { onCancel } = this.props;

    onCancel();
  }

  handlePerformLogin(username, password) {
    const { login } = this.props;

    const resolvedUsername = username.toLowerCase();
    this.setState({ inProgress: true });
    login(resolvedUsername, password)
      .then(this.handleLoginSuccess)
      .catch(this.handleLoginFailed);
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
    } = this.props;

    this.setState({ inProgress: false });
    saveSession(JSON.stringify({ access_token }));
    userLoggedIn({ user, access_token }).then(() => {
      InteractionManager.runAfterInteractions(() => {
        hideShortcuts(user);
        onLoginSuccess(user);
      });
    });
  }

  handleLoginFailed({ payload }) {
    const { response } = payload;

    const code = _.get(response, 'errors[0].code');
    const errorCode = getErrorCode(code);
    const errorMessage = getErrorMessage(errorCode);

    this.setState({ inProgress: false });
    Alert.alert(I18n.t(ext('loginFailedErrorTitle')), errorMessage);
  }

  handleRegisterPress() {
    const { onLoginSuccess, settings } = this.props;

    const manuallyApproveMembers = _.get(settings, 'manuallyApproveMembers');

    navigateTo(ext('RegisterScreen'), {
      manualApprovalActive: manuallyApproveMembers,
      onRegisterSuccess: onLoginSuccess,
    });
  }

  render() {
    const { isUserAuthenticated, settings, style } = this.props;
    const { inProgress } = this.state;

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

    // We want to display the authenticating state if the auth request is in
    // progress, or if we are already authenticated. The latter case can happen
    // if the login screen is left in the navigation stack history, but the user
    // authenticated successfully in another part of the app. E.g. open one
    // protected tab login screen will appear, now open a second tab again a
    // loading screen will apear if you log in on any stack, on other stacks
    // spinner will be shown instead of login form.
    const isLoading = inProgress || isUserAuthenticated;
    const resolvedSpinnerStyle = !isLoading ? style.hideComponent : {};
    const resolvedLoginScreenStyle = isLoading ? style.hideComponent : {};

    return (
      <Screen style={style.loginScreen}>
        <Spinner styleName="xl-gutter-top" style={resolvedSpinnerStyle} />

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={resolvedLoginScreenStyle}
        >
          {isEmailAuthEnabled && (
            <LoginForm
              onSubmit={this.handlePerformLogin}
              onForgotPasswordPress={this.handleForgotPasswordPress}
            />
          )}

          {isEmailAuthEnabled &&
            (isEligibleForAppleSignIn || isFacebookAuthEnabled) && (
              <HorizontalSeparator />
            )}

          {isEligibleForAppleSignIn && (
            <AppleSignInButton
              onLoginFailed={this.handleLoginFailed}
              onLoginSuccess={this.handleLoginSuccess}
            />
          )}
          {isFacebookAuthEnabled && (
            <FacebookButton
              onLoginFailed={this.handleLoginFailed}
              onLoginSuccess={this.handleLoginSuccess}
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

const mapDispatchToProps = {
  login,
  userLoggedIn,
  hideShortcuts,
};

function mapStateToProps(state, ownProps) {
  return {
    user: getUser(state),
    isUserAuthenticated: isAuthenticated(state),
    appId: getAppId(),
    settings: getExtensionSettings(state, ext()),
    access_token: getAccessToken(state),
    isAuthenticated: isAuthenticated(state),
    ...getRouteParams(ownProps),
  };
}

export default loginRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('LoginScreen'))(LoginScreen)),
  false,
);
