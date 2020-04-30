import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Alert, InteractionManager, Platform, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import autoBind from 'auto-bind';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { isScreenActive, NavigationBar, navigateTo } from 'shoutem.navigation';
import { isValid } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { Screen, Spinner, View, ScrollView, Device } from '@shoutem/ui';
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
  loginWithFacebook,
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
    interceptedShortcut: PropTypes.string,
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

  static defaultPropTypes = {
    onLoginSuccess: _.noop,
  };

  constructor(props, contex) {
    super(props, contex);

    autoBind(this);

    this.state = {
      inProgress: false,
    };
  }

  componentDidUpdate() {
    const {
      isScreenActive,
      isUserAuthenticated,
      onLoginSuccess,
      hideShortcuts,
      user,
    } = this.props;

    // We want to replace the login screen if the user is authenticated
    // but only if it's the currently active screen as we don't want to
    //  replace screens in the background
    const isLoggedIn = isScreenActive && isUserAuthenticated;

    // user becomes 'logged in' as soon as their auth token loads,
    // but this happens before the full user data gets returned, so we wait as
    // we need user's user groups populated for the hideShortcuts() to know what to hide
    const isValidUser = isValid(user);

    if (isLoggedIn && isValidUser) {
      // We are running the callback after interactions because of the bug
      // in navigation which prevents us from navigating to other screens
      // while in the middle of a transition
      InteractionManager.runAfterInteractions(() => {
        const { settings } = this.props;

        hideShortcuts(user, settings);
        onLoginSuccess();
      });
    }
  }

  performLogin(username, password) {
    if (_.isEmpty(username) || _.isEmpty(password)) {
      Alert.alert(
        I18n.t('shoutem.application.errorTitle'),
        I18n.t(ext('formNotFilledErrorMessage')),
      );
      return;
    }

    this.setState({ inProgress: true });
    this.props
      .login(username, password)
      .then(this.handleLoginSuccess)
      .catch(this.handleLoginFailed);
  }

  handleFacebookLoginSuccess(accessToken) {
    this.setState({ inProgress: true });
    this.props
      .loginWithFacebook(accessToken)
      .then(this.handleLoginSuccess)
      .catch(this.handleLoginFailed);
  }

  handleLoginSuccess() {
    const { access_token, user, userLoggedIn } = this.props;
    this.setState({ inProgress: false });
    saveSession(JSON.stringify({ access_token }));
    userLoggedIn({ user, access_token });
  }

  handleLoginFailed({ payload }) {
    const { response } = payload;

    const code = _.get(response, 'errors[0].code');
    const errorCode = getErrorCode(code);
    const errorMessage = getErrorMessage(errorCode);

    this.setState({ inProgress: false });
    Alert.alert(I18n.t(ext('loginFailedErrorTitle')), errorMessage);
  }

  openRegisterScreen() {
    const { interceptedShortcut, navigateTo } = this.props;

    const manuallyApproveMembers = _.get(
      this.props,
      'settings.manuallyApproveMembers',
    );
    const route = {
      screen: ext('RegisterScreen'),
      props: {
        manualApprovalActive: manuallyApproveMembers,
        shortcutToReturnTo: interceptedShortcut,
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
          {isEmailAuthEnabled && <LoginForm onSubmit={this.performLogin} />}

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
              onLoginSuccess={this.handleFacebookLoginSuccess}
            />
          )}

          {isSignupEnabled && (
            <RegisterButton onPress={this.openRegisterScreen} />
          )}
        </ScrollView>
      </Screen>
    );
  }
}

const mapDispatchToProps = {
  navigateTo,
  login,
  loginWithFacebook,
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
