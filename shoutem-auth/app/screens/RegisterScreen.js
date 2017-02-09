import React, {
  Component,
} from 'react';

import {
  TextInput,
  Screen,
  Divider,
  Button,
  Text,
} from '@shoutem/ui';

import {
  Alert,
} from 'react-native';

import { register } from '../redux.js';

import { getAppId } from 'shoutem.application';

import _ from 'lodash';

import { ext } from '../const';

import { connect } from 'react-redux';

import { loginRequired } from '../loginRequired';

import { errorMessages, getErrorMessage } from '../errorMessages';

import { NavigationBar } from '@shoutem/ui/navigation';

import { navigateBack } from '@shoutem/core/navigation';

export class RegisterScreen extends Component {
  static propTypes = {
    navigateBack: React.PropTypes.func,
    register: React.PropTypes.func,
    appId: React.PropTypes.any,
  };

  constructor(props, contex) {
    super(props, contex);
    this.performRegistration = this.performRegistration.bind(this);

    this.state = {
      email: undefined,
      username: undefined,
      password: undefined,
    };
  }

  performRegistration() {
    const { register, navigateBack } = this.props;
    const { email, username, password } = this.state;
    if (_.isEmpty(email) || _.isEmpty(username) || _.isEmpty(password)) {
      Alert.alert('Error', errorMessages.EMPTY_FIELDS);
      return;
    }
    register(email, username, password).then(() => navigateBack(), ({ payload }) => {
      const { response } = payload;
      Alert.alert('Registration failed', getErrorMessage(response && response.code));
    });
  }

  render() {
    return (
      <Screen>
        <NavigationBar title="REGISTER" />
        <Divider styleName="section-header" />
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          keyboardAppearance="dark"
          onChangeText={(email) => this.setState({ email })}
          returnKeyType="done"
        />
        <Divider styleName="line" />
        <TextInput
          placeholder="Username"
          autoCapitalize="none"
          autoCorrect={false}
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
          onPress={this.performRegistration}
        >
          <Text>REGISTER</Text>
        </Button>
        <Divider styleName="line" />
      </Screen>
    );
  }
}

export const mapDispatchToProps = { navigateBack, register };

function mapStateToProps(state) {
  return {
    user: state[ext()].user,
    appId: getAppId(),
  };
}

export default loginRequired(connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterScreen), false);
