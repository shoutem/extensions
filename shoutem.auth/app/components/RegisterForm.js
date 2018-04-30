import React, { Component } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import isEmail from 'is-email';

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
import { errorMessages } from '../errorMessages';

const { func } = PropTypes;

class RegisterForm extends Component {
  static propTypes = {
    onSubmit: func,
  };

  static defaultProps = {
    onSubmit: _.noop,
  };

  constructor(props) {
    super(props);

    this.handleRegisterButtonPress = this.handleRegisterButtonPress.bind(this);
    this.handleEmailChangeText = this.handleEmailChangeText.bind(this);
    this.handleUsernameChangeText = this.handleUsernameChangeText.bind(this);
    this.handlePasswordChangeText = this.handlePasswordChangeText.bind(this);
    this.validateInput = this.validateInput.bind(this);

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
      Alert.alert(I18n.t('shoutem.application.errorTitle'), errorMessages.EMPTY_FIELDS);
      return false;
    }

    if (!isEmail(email)) {
      Alert.alert(I18n.t('shoutem.application.errorTitle'), errorMessages.SIGNUP_EMAIL_INVALID);
      return false;
    }

    if (!password || password.length < 6) {
      Alert.alert(I18n.t('shoutem.application.errorTitle'), errorMessages.SIGNUP_PASSWORD_INVALID);
      return false;
    }

    const usernameRegexMatch = username.match(this.usernameRegex);
    if (!username || !usernameRegexMatch) {
      Alert.alert(I18n.t('shoutem.application.errorTitle'), errorMessages.SIGNUP_USERNAME_INVALID);
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
    return (
      <View>
        <Divider />
        <Divider styleName="line" />
        <TextInput
          placeholder={I18n.t(ext('emailPlaceholder'))}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          keyboardAppearance="dark"
          onChangeText={this.handleEmailChangeText}
          returnKeyType="done"
        />
        <Divider styleName="line" />
        <TextInput
          placeholder={I18n.t(ext('usernamePlaceholder'))}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance="dark"
          onChangeText={this.handleUsernameChangeText}
          returnKeyType="done"
        />
        <Divider styleName="line" />
        <TextInput
          placeholder={I18n.t(ext('passwordPlaceholder'))}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance="dark"
          secureTextEntry
          onChangeText={this.handlePasswordChangeText}
          returnKeyType="done"
        />
        <Divider styleName="line" />
        <Divider />
        <Button
          styleName="full-width inflexible"
          onPress={this.handleRegisterButtonPress}
        >
          <Text>{I18n.t(ext('registerButton'))}</Text>
        </Button>
      </View>
    );
  }
}

export default connectStyle(ext('RegisterForm'))(RegisterForm);
