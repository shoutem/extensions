import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Alert,
  InteractionManager,
} from 'react-native';

import {
  Screen,
  Divider,
  Spinner,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';
import { connectStyle } from '@shoutem/theme';
import {
  navigateTo,
  isScreenActive,
} from '@shoutem/core/navigation';
import { isValid } from '@shoutem/redux-io';

import {
  getAppId,
  getExtensionSettings,
} from 'shoutem.application';
import { I18n } from 'shoutem.i18n';

import { saveSession } from '../session';
import { loginRequired } from '../loginRequired';
import RegisterButton from '../components/RegisterButton';
import LoginForm from '../components/LoginForm';
import FacebookButton from '../components/FacebookButton';
import {
  login,
  loginWithFacebook,
  isAuthenticated,
  userLoggedIn,
  getUser,
  getAccessToken,
  hideShortcuts,
} from '../redux';
import {
  getErrorCode,
  getErrorMessage,
} from '../errorMessages';
import { ext } from '../const';

const {
  bool,
  func,
  shape,
  string,
} = PropTypes;

export class LoginScreen extends PureComponent {
  static propTypes = {
    navigateTo: func,
    login: func,
    loginWithFacebook: func,
    isUserAuthenticated: bool,
    inProgress: bool,
    onLoginSuccess: func,
    hideShortcuts: func,
    user: shape({
      id: string,
    }),
    access_token: string,
    settings: shape({
      providers: shape({
        email: shape({
          enabled: bool,
        }),
        facebook: shape({
          appId: string,
          appName: string,
          enabled: bool,
        }),
      }),
      signupEnabled: bool,
    }),
    // Dispatched with user data returned from server when user has logged in
    userLoggedIn: func,
  };

  static defaultPropTypes = {
    onLoginSuccess: _.noop,
  };

  constructor(props, contex) {
    super(props, contex);

    this.performLogin = this.performLogin.bind(this);
    this.handleFacebookLoginSuccess = this.handleFacebookLoginSuccess.bind(this);
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
    this.handleLoginFailed = this.handleLoginFailed.bind(this);
    this.openRegisterScreen = this.openRegisterScreen.bind(this);

    this.state = {
      inProgress: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      isScreenActive,
      isUserAuthenticated,
      onLoginSuccess,
      hideShortcuts,
      user,
    } = nextProps;

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
        const { settings } = nextProps;

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
    this.props.login(username, password)
      .then(this.handleLoginSuccess)
      .catch(this.handleLoginFailed);
  }

  handleFacebookLoginSuccess(accessToken) {
    this.setState({ inProgress: true });
    this.props.loginWithFacebook(accessToken)
      .then(this.handleLoginSuccess)
      .catch(this.handleLoginFailed);
  }

  handleLoginSuccess() {
    this.setState({ inProgress: false });
    const { user, access_token } = this.props;

    saveSession(JSON.stringify({ access_token }));
    this.props.userLoggedIn({ user, access_token });
  }

  handleLoginFailed({ payload }) {
    const { response } = payload;

    this.setState({ inProgress: false });

    const code = _.get(response, 'errors[0].code');
    const errorCode = getErrorCode(code);
    const errorMessage = getErrorMessage(errorCode);

    Alert.alert(I18n.t(ext('loginFailedErrorTitle')), errorMessage);
  }

  openRegisterScreen() {
    const manuallyApproveMembers = _.get(this.props, 'settings.manuallyApproveMembers');
    const route = {
      screen: ext('RegisterScreen'),
      props: {
        manualApprovalActive: manuallyApproveMembers,
      }
    };
    this.props.navigateTo(route);
  }

  render() {
    const { inProgress } = this.state;
    const { isUserAuthenticated, settings } = this.props;

    const isEmailAuthEnabled = _.get(settings, 'providers.email.enabled');
    const isFacebookAuthEnabled = _.get(settings, 'providers.facebook.enabled');
    const isSignupEnabled = _.get(settings, 'signupEnabled');

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
      <Screen>
        <NavigationBar title={I18n.t(ext('logInNavBarTitle'))} />
        {isEmailAuthEnabled &&
          <LoginForm onSubmit={this.performLogin} />
        }
        {isFacebookAuthEnabled &&
          <FacebookButton
            onLoginFailed={this.handleLoginFailed}
            onLoginSuccess={this.handleFacebookLoginSuccess}
          />
        }
        {isSignupEnabled &&
          <RegisterButton onPress={this.openRegisterScreen} />
        }
        <Divider />
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

export default loginRequired(connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('LoginScreen'))(LoginScreen)), false);
