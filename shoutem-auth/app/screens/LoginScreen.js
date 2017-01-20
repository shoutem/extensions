import React, {
  Component,
} from 'react';

import { navigateTo } from '@shoutem/core/navigation';
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
} from '@shoutem/ui';

import {
  Alert,
} from 'react-native';

import { login } from '../redux.js';

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
    accessToken: React.PropTypes.any,
    appId: React.PropTypes.any,
    error: React.PropTypes.any,
    settings: React.PropTypes.any,
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

  openRegisterScreen() {
    const { navigateTo } = this.props;
    const route = {
      screen: ext('RegisterScreen'),
      props: { action: this.props.action },
    };
    navigateTo(route);
  }

  performLogin() {
    const { login, appId } = this.props;
    const { username, password } = this.state;

    if (_.isEmpty(username) || _.isEmpty(password)) {
      Alert.alert('Error', 'All fields are mandatory check if you forgot to fill some.');
      return;
    }

    login(appId, username, password).then((response) => {
      const { error, onLoginSuccess } = this.props;

      if (_.isFunction(onLoginSuccess) && _.isEmpty(error)) {
        onLoginSuccess(response.user);
      }
      if (!_.isEmpty(error)) {
        Alert.alert(
            'Login failure',
            error,
        );
      }
    }, (response) => console.log('ERROR IN LOGIN SERVER COMMUNICATION', response));
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
    this.props.setNavBarProps({
      title: 'LOG IN',
    });
    return (
      <Screen>
        {this.renderLoginComponent()}
        {this.renderRegisterButton()}
        <Divider styleName="section-header" />
      </Screen>
    );
  }
}

const mapDispatchToProps = { navigateTo, login };

function mapStateToProps(state) {
  return {
    user: state[ext()].user,
    accessToken: state[ext()].accessToken,
    error: state[ext()].error,
    appId: getAppId(),
    extensions: state['shoutem.application'].extensions,
    settings: getExtensionSettings(state, ext()),
  };
}

export default loginRequired(connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen), false);
