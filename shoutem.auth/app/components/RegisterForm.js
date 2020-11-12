import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import isEmail from 'is-email';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';

import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Button,
  Text,
  TextInput,
  View,
} from '@shoutem/ui';

import { I18n } from 'shoutem.i18n';

import { ext } from '../const';
import { errorMessages } from '../errorMessages';
import PasswordTextInput from './PasswordTextInput';

class RegisterForm extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    style: PropTypes.object,
  };

  static defaultProps = {
    onSubmit: _.noop,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    // minimum 3 characters, starts with letter,
    // contains letters, numbers, dashes and underscores
    this.usernameRegex = /^[a-zA-Z]+\w{2,63}$/;

    this.state = {
      email: '',
      emailError: null,
      isEmailFocused: false,
      isUsernameFocused: false,
      username: '',
      usernameError: null,
      password: '',
      passwordError: null,
    };
  }

  validateInput() {
    const { email, username, password } = this.state;

    let isValid = true;
    if (_.isEmpty(email) || _.isEmpty(username) || _.isEmpty(password)) {
      Alert.alert(
        I18n.t('shoutem.application.errorTitle'),
        errorMessages.EMPTY_FIELDS,
      );

      isValid = false;
    }

    if (!isEmail(email)) {
      this.setState({ emailError: errorMessages.SIGNUP_EMAIL_INVALID });

      isValid = false;
    } else {
      this.setState({ emailError: null });
    }

    if (!password || password.length < 6) {
      this.setState({ passwordError: errorMessages.SIGNUP_PASSWORD_INVALID });

      isValid = false;
    } else {
      this.setState({ passwordError: null });
    }

    const usernameRegexMatch = username.match(this.usernameRegex);
    if (!username || !usernameRegexMatch || username.toLowerCase() !== username) {
      this.setState({ usernameError: errorMessages.SIGNUP_USERNAME_INVALID });

      isValid = false;
    } else {
      this.setState({ usernameError: null });

    }

    return isValid;
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
    const {
      emailError,
      isEmailFocused,
      isUsernameFocused,
      password,
      passwordError,
      usernameError,
    } = this.state;

    return (
      <View>
        <Text>Email</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          errorMessage={emailError}
          highlightOnFocus
          keyboardAppearance="dark"
          keyboardType="email-address"
          onChangeText={this.handleEmailChangeText}
          placeholder={I18n.t(ext('emailPlaceholder'))}
          returnKeyType="done"
        />

        <Text styleName="lg-gutter-top">Username</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          errorMessage={usernameError}
          highlightOnFocus
          keyboardAppearance="dark"
          onChangeText={this.handleUsernameChangeText}
          placeholder={I18n.t(ext('usernamePlaceholder'))}
          returnKeyType="done"
        />

        <Text styleName="lg-gutter-top">Password</Text>
        <PasswordTextInput
          onChangeText={this.handlePasswordChangeText}
          password={password}
          errorMessage={passwordError}
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
