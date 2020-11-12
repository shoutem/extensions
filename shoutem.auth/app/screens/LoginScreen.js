import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Alert, InteractionManager, Platform } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import autoBind from 'auto-bind';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { isScreenActive, NavigationBar, navigateTo } from 'shoutem.navigation';
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
    navigateTo: PropTypes.func,
    login: PropTypes.func,
    loginWithFacebook: PropTypes.func,
    isUserAuthenticated: PropTypes.bool,
    inProgress: PropTypes.bool,
    onLoginSuccess: PropTypes.func,
    interceptedRoute: PropTypes.object,
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

  constructor(props, contex) {
    super(props, contex);

    autoBind(this);

    this.state = { inProgress: false };
  }

  handlePerformLogin(username, password) {
    const { login } = this.props;

    if (_.isEmpty(username) || _.isEmpty(password)) {
      Alert.alert(
        I18n.t('shoutem.application.errorTitle'),
        I18n.t(ext('formNotFilledErrorMessage')),
      );
      return;
    }

    const resolvedUsername = username.toLowerCase();
    this.setState({ inProgress: true });
    login(resolvedUsername, password)
      .then(this.handleLoginSuccess)
      .catch(this.handleLoginFailed);
  }

  handleLoginSuccess() {
    const {
      access_token,
      user,
      userLoggedIn,
      onLoginSuccess,
      isScreenActive,
      hideShortcuts,
    } = this.props;

    this.setState({ inProgress: false });
    saveSession(JSON.stringify({ access_token }));
    userLoggedIn({ user, access_token }).then(() => {
      if (isScreenActive) {
        InteractionManager.runAfterInteractions(() => {
          const { settings } = this.props;

          hideShortcuts(user, settings);
          onLoginSuccess();
        });
      }
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
    const { interceptedRoute, navigateTo } = this.props;

    const manuallyApproveMembers = _.get(
      this.props,
      'settings.manuallyApproveMembers',
    );
    const route = {
      screen: ext('RegisterScreen'),
      props: {
        manualApprovalActive: manuallyApproveMembers,
        routeToReturnTo: interceptedRoute,
      },
    };

    navigateTo(route);
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

    if (isLoading) {
      return (
        <Screen>
          <NavigationBar title={I18n.t(ext('logInNavBarTitle'))} />
          <Spinner styleName="xl-gutter-top" />
        </Screen>
      );
    }

    return (
      <Screen style={style.loginScreen}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <NavigationBar title={I18n.t(ext('logInNavBarTitle'))} />
          {isEmailAuthEnabled && <LoginForm onSubmit={this.handlePerformLogin} />}

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
  navigateTo,
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
    isScreenActive: isScreenActive(state, ownProps.screenId),
    access_token: getAccessToken(state),
  };
}

export default loginRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('LoginScreen'))(LoginScreen)),
  false,
);
