import React, {
  Component,
} from 'react';

import { navigateTo, isScreenActive } from '@shoutem/core/navigation';
import { ext } from '../const';

import { connect } from 'react-redux';

import _ from 'lodash';

import {
  TextInput,
  Screen,
  Divider,
  Button,
  Text,
  Caption,
  View,
  Spinner,
} from '@shoutem/ui';

import { NavigationBar } from '@shoutem/ui/navigation';

import {
  Alert,
  InteractionManager,
} from 'react-native';

import { login, isAuthenticated } from '../redux.js';
import { errorMessages, getErrorMessage } from '../errorMessages';

import { getAppId, getExtensionSettings } from 'shoutem.application';
import { loginRequired } from '../loginRequired';

export class LoginScreen extends Component {
  static propTypes = {
    setNavBarProps: React.PropTypes.func,
    navigateTo: React.PropTypes.func,
    login: React.PropTypes.func,
    logout: React.PropTypes.func,
    onLoginSuccess: React.PropTypes.func,
    action: React.PropTypes.any,
    focused: React.PropTypes.any,
    extensions: React.PropTypes.any,

    user: React.PropTypes.any,
    isAuthenticated: React.PropTypes.bool,
    appId: React.PropTypes.any,
    settings: React.PropTypes.any,
    isScreenActive: React.PropTypes.bool,
  };

  constructor(props, contex) {
    super(props, contex);

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
    if (isScreenActive && isAuthenticated) {
      // We are running the callback after interactions because of the bug
      // in navigation which prevents us from navigating to other screens
      // while in the middle of a transition
      InteractionManager.runAfterInteractions(onLoginSuccess);
    }
  }

  openRegisterScreen() {
    const { navigateTo } = this.props;
    const route = {
      screen: ext('RegisterScreen'),
    };
    navigateTo(route);
  }

  performLogin() {
    const { login } = this.props;
    const { username, password } = this.state;

    if (_.isEmpty(username) || _.isEmpty(password)) {
      Alert.alert('Error', errorMessages.EMPTY_FIELDS);
      return;
    }

    login(username, password).then(({ payload }) => {
      const { onLoginSuccess } = this.props;

      if (_.isFunction(onLoginSuccess)) {
        onLoginSuccess(payload.user);
      }
    }, ({ payload }) => {
      const { response } = payload;
      Alert.alert('Login failure', getErrorMessage(response && response.code));
    });
  }

  renderRegisterButton() {
    const { settings } = this.props;
    let buttons = null;
    if (settings.signupEnabled) {
      buttons = (
        <View>
          <Caption styleName="h-center lg-gutter-vertical">
            Not a member?
          </Caption>
          <Button styleName="full-width inflexible" onPress={this.openRegisterScreen}>
            <Text>REGISTER</Text>
          </Button>
        </View>
      );
    }
    return buttons;
  }

  renderLoginComponent() {
    const { settings } = this.props;
    let components = null;
    if (settings.providers.email.enabled) {
      components = (
        <View>
          <Divider styleName="section-header" />
          <TextInput
            placeholder="Username or Email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            keyboardAppearance="dark"
            onChangeText={(username) => this.setState({ username })}
            returnKeyType="done"
          />
          <Divider styleName="line" />
          <TextInput
            placeholder="Password"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardAppearance="dark"
            secureTextEntry
            onChangeText={(password) => this.setState({ password })}
            returnKeyType="done"
          />
          <Divider styleName="section-header" />
          <Button
            styleName="full-width inflexible"
            onPress={this.performLogin}
          >
            <Text>LOG IN</Text>
          </Button>
        </View>
      );
    }
    return components;
  }

  render() {
    const components = !this.props.isAuthenticated ? (
      <View>
        <NavigationBar title="LOG IN" />
        {this.renderLoginComponent()}
        {this.renderRegisterButton()}
        <Divider styleName="section-header" />
      </View>
    ) : <Spinner style={{ marginTop: 25 }} />; // TODO - use a styleName
    return (
      <Screen>
        {components}
      </Screen>
    );
  }
}

const mapDispatchToProps = { navigateTo, login };

function mapStateToProps(state, ownProps) {
  return {
    user: state[ext()].user,
    isAuthenticated: isAuthenticated(state),
    appId: getAppId(),
    extensions: state['shoutem.application'].extensions,
    settings: getExtensionSettings(state, ext()),
    isScreenActive: isScreenActive(state, ownProps.screenId),
  };
}

export default loginRequired(connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen), false);
