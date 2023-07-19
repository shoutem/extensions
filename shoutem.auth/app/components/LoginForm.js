import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Spinner, Text, TextInput, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { errorMessages } from '../errorMessages';
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
      usernameError: null,
      passwordError: null,
    };
  }

  validateInputs(username, password) {
    let isValid = true;

    if (_.isEmpty(username)) {
      isValid = false;

      this.setState({ usernameError: errorMessages.USERNAME_EMPTY });
    }

    if (_.isEmpty(password)) {
      isValid = false;

      this.setState({ passwordError: errorMessages.PASSWORD_EMPTY });
    }

    return isValid;
  }

  handleLoginButtonPress() {
    const { onSubmit } = this.props;
    const { username, password } = this.state;

    this.setState(
      {
        usernameError: null,
        passwordError: null,
      },
      () => {
        const validationPassed = this.validateInputs(username, password);

        if (onSubmit && validationPassed) {
          onSubmit(username, password).then(() =>
            this.setState({ password: '' }),
          );
        }
      },
    );
  }

  handleUsernameChange(username) {
    this.setState({ username });
  }

  handlePasswordChange(password) {
    this.setState({ password });
  }

  render() {
    const { inProgress, style, onForgotPasswordPress } = this.props;
    const { username, password, usernameError, passwordError } = this.state;

    return (
      <View>
        <View style={style.usernameContainer} styleName="lg-gutter-bottom">
          <Text>{I18n.t(ext('usernameOrEmail'))}</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardAppearance="dark"
            keyboardType="email-address"
            onChangeText={this.handleUsernameChange}
            placeholder={I18n.t(ext('usernameOrEmailPlaceholder'))}
            errorMessage={usernameError}
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
          errorMessage={passwordError}
        />
        <Button
          onPress={this.handleLoginButtonPress}
          style={style.loginButton}
          disabled={inProgress}
        >
          {inProgress && <Spinner />}
          {!inProgress && (
            <Text allowFontScaling={false}>{I18n.t(ext('logInButton'))}</Text>
          )}
        </Button>
      </View>
    );
  }
}

export default connectStyle(ext('LoginForm'))(LoginForm);
