import React, { PureComponent } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBind from 'auto-bind';
import isEmail from 'is-email';
import { View, TextInput, Button, Text } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { I18n } from 'shoutem.i18n';
import PasswordTextInput from './PasswordTextInput';
import { ext } from '../const';
import { errorMessages } from '../errorMessages';

const { func } = PropTypes;

class RegisterForm extends PureComponent {
  static propTypes = {
    onSubmit: func,
  };

  static defaultProps = {
    onSubmit: _.noop,
  };

  constructor(props) {
    super(props);

    autoBind(this);

    // minimum 3 characters, starts with letter,
    // contains letters, numbers, dashes and underscores
    this.usernameRegex = /^[a-zA-Z]+\w{2,63}$/;

    this.state = {
      email: '',
      username: '',
      password: '',
    };
  }

  validateInput() {
    const { email, username, password } = this.state;

    if (_.isEmpty(email) || _.isEmpty(username) || _.isEmpty(password)) {
      Alert.alert(
        I18n.t('shoutem.application.errorTitle'),
        errorMessages.EMPTY_FIELDS,
      );
      return false;
    }

    if (!isEmail(email)) {
      Alert.alert(
        I18n.t('shoutem.application.errorTitle'),
        errorMessages.SIGNUP_EMAIL_INVALID,
      );
      return false;
    }

    if (!password || password.length < 6) {
      Alert.alert(
        I18n.t('shoutem.application.errorTitle'),
        errorMessages.SIGNUP_PASSWORD_INVALID,
      );
      return false;
    }

    const usernameRegexMatch = username.match(this.usernameRegex);
    if (!username || !usernameRegexMatch) {
      Alert.alert(
        I18n.t('shoutem.application.errorTitle'),
        errorMessages.SIGNUP_USERNAME_INVALID,
      );
      return false;
    }

    return true;
  }

  handleRegisterButtonPress() {
    const { onSubmit } = this.props;
    const { email, username, password } = this.state;

    const validationPassed = this.validateInput();

    if (validationPassed && onSubmit) {
      onSubmit(email, username, password);
    }
  }

  handleEmailChangeText(email) {
    this.setState({ email });
  }

  handleUsernameChangeText(username) {
    this.setState({ username });
  }

  handlePasswordChangeText(password) {
    this.setState({ password });
  }

  render() {
    const { style } = this.props;
    const { password } = this.state;

    return (
      <View>
        <Text>Email</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance="dark"
          keyboardType="email-address"
          onChangeText={this.handleEmailChangeText}
          placeholder={I18n.t(ext('emailPlaceholder'))}
          returnKeyType="done"
        />

        <Text>Username</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance="dark"
          onChangeText={this.handleUsernameChangeText}
          placeholder={I18n.t(ext('usernamePlaceholder'))}
          returnKeyType="done"
        />

        <Text>Password</Text>
        <PasswordTextInput
          onChangeText={this.handlePasswordChangeText}
          password={password}
        />

        <Button
          onPress={this.handleRegisterButtonPress}
          style={style.registerButton}
          styleName="confirmation inflexible"
        >
          <Text allowFontScaling={false}>{I18n.t(ext('registerButton'))}</Text>
        </Button>
      </View>
    );
  }
}

export default connectStyle(ext('RegisterForm'))(RegisterForm);
