import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import isEmail from 'is-email';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Spinner,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { errorMessages } from '../errorMessages';
import ConsentCheckbox from './ConsentCheckbox';
import PasswordTextInput from './PasswordTextInput';

class RegisterForm extends PureComponent {
  static propTypes = {
    inProgress: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func,
    style: PropTypes.object,
    gdprSettings: PropTypes.object,
    newsletterSettings: PropTypes.object,
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

    const email = _.get(props, 'email', '');

    this.state = {
      email,
      emailError: null,
      username: '',
      usernameError: null,
      password: '',
      passwordError: null,
      gdprConsentError: null,
      gdprConsentGiven: false,
      newsletterConsentGiven: false,
    };
  }

  validateInput() {
    const { gdprSettings } = this.props;
    const { email, username, password, gdprConsentGiven } = this.state;

    const consentRequired = _.get(gdprSettings, 'consentRequired', false);

    let isValid = true;

    if (consentRequired && !gdprConsentGiven) {
      this.setState({
        gdprConsentError: errorMessages.CONSENT_REQUIRED,
      });

      isValid = false;
    }

    if (!isEmail(email)) {
      this.setState({ emailError: errorMessages.SIGNUP_EMAIL_INVALID });

      isValid = false;
    }

    if (!password || password.length < 6) {
      this.setState({
        passwordError: errorMessages.SIGNUP_PASSWORD_INVALID,
      });

      isValid = false;
    }

    const usernameRegexMatch = username.match(this.usernameRegex);
    if (
      !username ||
      !usernameRegexMatch ||
      username.toLowerCase() !== username
    ) {
      this.setState({
        usernameError: errorMessages.SIGNUP_USERNAME_INVALID,
      });

      isValid = false;
    }

    return isValid;
  }

  handleRegisterButtonPress() {
    const { onSubmit } = this.props;
    const {
      email,
      username,
      password,
      newsletterConsentGiven,
      gdprConsentGiven,
    } = this.state;

    this.setState(
      {
        emailError: null,
        usernameError: null,
        passwordError: null,
        gdprConsentError: null,
      },
      () => {
        const validationPassed = this.validateInput();

        if (validationPassed && onSubmit) {
          onSubmit(
            email,
            username,
            password,
            gdprConsentGiven,
            newsletterConsentGiven,
          );
        }
      },
    );
  }

  handleGdprConsentToggle() {
    const { gdprConsentGiven } = this.state;

    this.setState({ gdprConsentGiven: !gdprConsentGiven });
  }

  handleNewsletterConsentToggle() {
    const { newsletterConsentGiven } = this.state;

    this.setState({ newsletterConsentGiven: !newsletterConsentGiven });
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
    const {
      style,
      gdprSettings,
      inProgress,
      newsletterSettings,
      emailTaken,
      onRecoverPasswordPress,
    } = this.props;
    const {
      email,
      emailError,
      password,
      passwordError,
      usernameError,
      gdprConsentGiven,
      gdprConsentError,
      newsletterConsentGiven,
    } = this.state;

    const { consentToggleActive: gdprToggleActive } = gdprSettings;

    const { consentToggleActive: newsletterToggleActive } = newsletterSettings;

    return (
      <>
        <View styleName="lg-gutter-vertical">
          <Text>{I18n.t(ext('email'))}</Text>
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
            value={email}
          />
          {emailTaken && (
            <>
              <Caption styleName="form-error sm-gutter-top">
                {I18n.t(ext('emailTakenErrorMessage'))}
              </Caption>
              <TouchableOpacity onPress={onRecoverPasswordPress}>
                <Caption styleName="sm-gutter-top">
                  {I18n.t(ext('recoverPasswordText'))}
                </Caption>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View styleName="lg-gutter-bottom">
          <Text>{I18n.t(ext('username'))}</Text>
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
        </View>
        <View styleName="lg-gutter-bottom">
          <Text>{I18n.t(ext('password'))}</Text>
          <PasswordTextInput
            onChangeText={this.handlePasswordChangeText}
            password={password}
            errorMessage={passwordError}
          />
        </View>
        {gdprToggleActive && (
          <ConsentCheckbox
            checked={gdprConsentGiven}
            onToggle={this.handleGdprConsentToggle}
            description={I18n.t(ext('gdprConsentMessage'))}
            error={gdprConsentError}
          />
        )}
        {newsletterToggleActive && (
          <ConsentCheckbox
            checked={newsletterConsentGiven}
            onToggle={this.handleNewsletterConsentToggle}
            description={I18n.t(ext('newsletterConsentMessage'))}
          />
        )}
        <Button
          onPress={this.handleRegisterButtonPress}
          style={style.registerButton}
          styleName="confirmation inflexible"
          disabled={inProgress}
        >
          {inProgress && <Spinner />}
          {!inProgress && (
            <Text allowFontScaling={false}>
              {I18n.t(ext('registerButton'))}
            </Text>
          )}
        </Button>
      </>
    );
  }
}

export default connectStyle(ext('RegisterForm'))(RegisterForm);
