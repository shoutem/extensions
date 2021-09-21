import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Alert, InteractionManager, Platform } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import autoBind from 'auto-bind';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import {
  getRouteParams,
  HeaderBackButton,
  navigateTo,
} from 'shoutem.navigation';
import { I18n } from 'shoutem.i18n';
import { connectStyle } from '@shoutem/theme';
import { Screen, Spinner, ScrollView } from '@shoutem/ui';
import { loginRequired } from '../loginRequired';
import FacebookButton from '../components/FacebookButton';
import AppleSignInButton from '../components/AppleSignInButton';
import LoginForm from '../components/LoginForm';
import RegisterButton from '../components/RegisterButton';
import HorizontalSeparator from '../components/HorizontalSeparator';
import { ext } from '../const';
import { getErrorCode, getErrorMessage } from '../errorMessages';
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

    autoBind(this);

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
        const { settings } = this.props;

        hideShortcuts(user, settings);
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
    const { inProgress } = this.state;

    const { isUserAuthenticated, settings, style } = this.props;
    const platformVersion = parseInt(Platform.Version, 10);

    const isEmailAuthEnabled = _.get(settings, 'providers.email.enabled');
    const isFacebookAuthEnabled = _.get(settings, 'providers.facebook.enabled');
    const isAppleAuthEnabled = _.get(settings, 'providers.apple.enabled');
    const isSignupEnabled = _.get(settings, 'signupEnabled');
    const isEligibleForAppleSignIn =
      isAppleAuthEnabled && Platform.OS === 'ios' && platformVersion >= 13;

    // We want to display the authenticating state if the
    // auth request is in progress, or if we are already
    // authenticated. The latter case can happen if the
    // login screen is left in the navigation stack history,
    // but the user authenticated successfully in another
    // part of the app. E.g. open one protected tab login screen will
    // appear, now open a second tab again a loading screen will apear
    // if you log in on any stack, on other stacks spinner will be shown
    // instead of login form
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

          {(isEligibleForAppleSignIn || isFacebookAuthEnabled) && (
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

          {isSignupEnabled && (
            <RegisterButton onPress={this.handleRegisterPress} />
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
