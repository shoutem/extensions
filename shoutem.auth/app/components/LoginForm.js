import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { connectStyle } from '@shoutem/theme';
import { Button, Text, TextInput, View } from '@shoutem/ui';

import { I18n } from 'shoutem.i18n';

import { ext } from '../const';
import PasswordTextInput from './PasswordTextInput';

class LoginForm extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    onSubmit: _.noop,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

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

  handleUsernameChange(username) {
    this.setState({ username });
  }

  handlePasswordChange(password) {
    this.setState({ password });
  }

  render() {
    const { style, onForgotPasswordPress } = this.props;
    const { username, password } = this.state;

    return (
      <View>
        <View style={style.usernameContainer} styleName="lg-gutter-bottom">
          <Text>{I18n.t(ext('usernameOrEmail'))}</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            highlightOnFocus
            keyboardAppearance="dark"
            keyboardType="email-address"
            onChangeText={this.handleUsernameChange}
            placeholder={I18n.t(ext('usernameOrEmailPlaceholder'))}
            returnKeyType="done"
            value={username}
          />
        </View>
        <View style={style.passwordLabelContainer}>
          <Text>{I18n.t(ext('password'))}</Text>
          <Button styleName="clear" onPress={onForgotPasswordPress}>
            <Text>{I18n.t(ext('forgotPasswordText'))}</Text>
          </Button>
        </View>
        <PasswordTextInput
          onChangeText={this.handlePasswordChange}
          password={password}
        />
        <Button onPress={this.handleLoginButtonPress} style={style.loginButton}>
          <Text allowFontScaling={false}>{I18n.t(ext('logInButton'))}</Text>
        </Button>
      </View>
    );
  }
}

export default connectStyle(ext('LoginForm'))(LoginForm);
