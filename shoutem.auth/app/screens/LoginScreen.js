import React, {
  Component,
} from 'react';

import {
  Alert,
  InteractionManager,
} from 'react-native';

import {
  AccessToken,
  LoginManager,
} from 'react-native-fbsdk';

import { connect } from 'react-redux';

import _ from 'lodash';

import {
  Icon,
  TextInput,
  Screen,
  Divider,
  Button,
  Text,
  Caption,
  View,
  Spinner,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import {
  navigateTo,
  isScreenActive,
} from '@shoutem/core/navigation';

import { isBusy } from '@shoutem/redux-io';

import {
  getAppId,
  getExtensionSettings,
} from 'shoutem.application';

import { I18n } from 'shoutem.i18n';

import { NavigationBar } from '@shoutem/ui/navigation';

import { ext } from '../const';

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
  errorMessages,
  getErrorMessage,
} from '../errorMessages';

import { saveSession } from '../session';

import { loginRequired } from '../loginRequired';

const renderAuthenticatingMessage = () => <Spinner styleName="xl-gutter-top" />;

const handleLoginError = ({ payload }) => {
  const { response } = payload;
  Alert.alert(I18n.t(ext('loginFailErrorTitle')), getErrorMessage(response && response.code));
};

const getFacebookAccessToken = () => AccessToken.refreshCurrentAccessTokenAsync().then(() =>
  AccessToken.getCurrentAccessToken());

const { bool, func, shape, string } = React.PropTypes;

export class LoginScreen extends Component {
  static propTypes = {
    navigateTo: func,
    login: func,
    loginWithFacebook: func,

    isAuthenticated: bool,
    isAuthenticating: bool,
    onLoginSuccess: func,
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

  constructor(props, contex) {
    super(props, contex);

    this.finishLogin = this.finishLogin.bind(this);
    this.loginWithFacebook = this.loginWithFacebook.bind(this);
    this.loginWithFacebookAccessToken = this.loginWithFacebookAccessToken.bind(this);
    this.openFacebookLogin = this.openFacebookLogin.bind(this);
    this.openRegisterScreen = this.openRegisterScreen.bind(this);
    this.performLogin = this.performLogin.bind(this);

    this.renderRegisterButton = this.renderRegisterButton.bind(this);
    this.renderLoginComponent = this.renderLoginComponent.bind(this);

    this.state = {
      username: null,
      password: null,
    };
  }

  componentWillReceiveProps(newProps) {
    const { isScreenActive, isAuthenticated, onLoginSuccess } = newProps;
    // We want to replace the login screen if the user is authenticated
    // but only if it's the currently active screen as we don't want to
    //  replace screens in the background
    if (isScreenActive && isAuthenticated && _.isFunction(onLoginSuccess)) {
      // We are running the callback after interactions because of the bug
      // in navigation which prevents us from navigating to other screens
      // while in the middle of a transition
      InteractionManager.runAfterInteractions(() => {
        const { user, settings } = newProps;
        const { hideShortcuts } = this.props;
        hideShortcuts(user, settings);
        onLoginSuccess()
      });
    }
  }

  openRegisterScreen() {
    const { navigateTo } = this.props;
    const route = {
      screen: ext('RegisterScreen'),
    };
    navigateTo(route);
  }

  loginWithFacebook() {
    getFacebookAccessToken()
      .then((data) => {
        if (data && data.accessToken) {
          this.loginWithFacebookAccessToken(data.accessToken);
        } else {
          throw new Error(I18n.t(ext('tokenErrorMessage')));
        }
      })
      .catch(this.openFacebookLogin);
  }

  openFacebookLogin() {
    LoginManager.logInWithReadPermissions(['public_profile', 'email'])
      .then((result) => {
        if (result.isCancelled) {
          throw new Error(I18n.t(ext('loginCancelErrorMessage')));
        }
        return AccessToken.getCurrentAccessToken();
      }).then((data) => {
      if (!(data && data.accessToken)) {
        throw new Error();
      }
      this.loginWithFacebookAccessToken(data.accessToken);
    }).catch((error) => {
      Alert.alert(I18n.t(ext('loginFailErrorTitle')), error.message || errorMessages.UNEXPECTED_ERROR);
    });
  }

  loginWithFacebookAccessToken(accessToken) {
    const { loginWithFacebook } = this.props;

    loginWithFacebook(accessToken)
      .then(response => this.finishLogin(response))
      .catch(handleLoginError);
  }

  finishLogin() {
    const { userLoggedIn, settings, user, access_token } = this.props;


    saveSession(JSON.stringify({ access_token }));
    userLoggedIn({
      user,
      access_token,
    });
  }

  performLogin() {
    const { login } = this.props;
    const { username, password } = this.state;

    if (_.isEmpty(username) || _.isEmpty(password)) {
      Alert.alert(I18n.t('shoutem.application.errorTitle'), I18n.t(ext('formNotFilledErrorMessage')));
      return;
    }

    login(username, password)
      .then(this.finishLogin)
      .catch(handleLoginError);
  }

  renderRegisterButton() {
    const { settings } = this.props;
    let buttons = null;
    if (settings.signupEnabled) {
      buttons = (
        <View>
          <Caption styleName="h-center lg-gutter-vertical">
            {I18n.t(ext('noAccountSectionTitle'))}
          </Caption>
          <Button styleName="full-width inflexible" onPress={this.openRegisterScreen}>
            <Text>{I18n.t(ext('registerButton'))}</Text>
          </Button>
        </View>
      );
    }
    return buttons;
  }

  renderLoginComponent() {
    const { settings } = this.props;
    const { username } = this.state;

    let components = null;
    if (settings.providers.email.enabled) {
      components = (
        <View>
          <Divider />
          <Divider styleName="line" />
          <TextInput
            placeholder={I18n.t(ext('usernameOrEmailPlaceholder'))}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            keyboardAppearance="dark"
            onChangeText={username => this.setState({ username })}
            returnKeyType="done"
            value={username}
          />
          <Divider styleName="line" />
          <TextInput
            placeholder={I18n.t(ext('passwordPlaceholder'))}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardAppearance="dark"
            secureTextEntry
            onChangeText={password => this.setState({ password })}
            returnKeyType="done"
          />
          <Divider styleName="line" />
          <Divider />
          <Button
            styleName="full-width inflexible"
            onPress={this.performLogin}
          >
            <Text>{I18n.t(ext('logInButton'))}</Text>
          </Button>
        </View>
      );
    }
    return components;
  }

  renderFacebookLoginButton() {
    return (
      <View>
        <Caption styleName="h-center lg-gutter-vertical">
          {I18n.t(ext('socialLoginSectionTitle'))}
        </Caption>
        <Button
          onPress={this.loginWithFacebook}
          styleName="full-width inflexible"
        >
          <Icon name="facebook" />
          <Text>{I18n.t(ext('facebookLogInButton'))}</Text>
        </Button>
      </View>
    );
  }

  render() {
    const { isAuthenticating, settings: { providers: { facebook } } } = this.props;
    let screenContent = null;
    if (isAuthenticating || this.props.isAuthenticated) {
      // We want to display the authenticating state if the
      // auth request is in progress, or if we are already
      // authenticated. The latter case can happen if the
      // login screen is left in the navigation stack history,
      // but the user authenticated successfully in another
      // part of the app.
      screenContent = renderAuthenticatingMessage();
    } else {
      screenContent = (
        <View>
          <NavigationBar title={I18n.t(ext('logInNavBarTitle'))} />
          {this.renderLoginComponent()}
          {facebook.enabled ? this.renderFacebookLoginButton() : null}
          {this.renderRegisterButton()}
          <Divider />
        </View>
      );
    }

    return (
      <Screen>
        {screenContent}
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
    isAuthenticated: isAuthenticated(state),
    isAuthenticating: isBusy(state[ext()]),
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
