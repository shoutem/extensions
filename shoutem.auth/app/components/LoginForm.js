import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBind from 'auto-bind';
import { Button, Text, TextInput, View } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { I18n } from 'shoutem.i18n';
import PasswordTextInput from './PasswordTextInput';
import { ext } from '../const';

class LoginForm extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    onSubmit: _.noop,
  };

  constructor(props) {
    super(props);

    autoBind(this);

    this.state = {
      isUsernameFocused: false,
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
    const { style } = this.props;
    const {
      isUsernameFocused,
      visibility,
      username,
      password,
    } = this.state;

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
            onBlur={this.handleUsernameBlur}
            onChangeText={this.handleUsernameChange}
            onFocus={this.handleUsernameFocus}
            placeholder={I18n.t(ext('usernameOrEmailPlaceholder'))}
            returnKeyType="done"
            value={username}
          />
        </View>
        <View style={style.passwordLabelContainer}>
          <Text>Password</Text>

          {/* A placeholder for "Forgot Password" feature
          <Button styleName="clear">
            <Text>Forgot Password?</Text>
          </Button>
          */}
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
