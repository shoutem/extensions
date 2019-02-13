import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
  View,
  Divider,
  TextInput,
  Button,
  Text,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';

import { ext } from '../const';

const { func } = PropTypes;

class LoginForm extends PureComponent {
  static propTypes = {
    onSubmit: func,
  };

  static defaultProps = {
    onSubmit: _.noop,
  };

  constructor(props) {
    super(props);

    this.handleLoginButtonPress = this.handleLoginButtonPress.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);

    this.state = {
      username: '',
      password: '',
    };
  }

  handleLoginButtonPress() {
    const { onSubmit } = this.props;
    const { username, password } = this.state;

    if (onSubmit) {
      onSubmit(username, password);
    }
  }

  handleUsernameChange(username){
    this.setState({ username });
  }

  handlePasswordChange(password) {
    this.setState({ password });
  }

  render() {
    return (
      <View>
        <Divider />
        <Divider styleName="line" />
        <TextInput
          placeholder={I18n.t(ext('usernameOrEmailPlaceholder'))}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          keyboardAppearance="dark"
          onChangeText={this.handleUsernameChange}
          returnKeyType="done"
          value={this.state.username}
        />
        <Divider styleName="line" />
        <TextInput
          placeholder={I18n.t(ext('passwordPlaceholder'))}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance="dark"
          secureTextEntry
          onChangeText={this.handlePasswordChange}
          returnKeyType="done"
        />
        <Divider styleName="line" />
        <Divider />
        <Button
          styleName="full-width inflexible"
          onPress={this.handleLoginButtonPress}
        >
          <Text>{I18n.t(ext('logInButton'))}</Text>
        </Button>
      </View>
    );
  }
}

export default connectStyle(ext('LoginForm'))(LoginForm);
