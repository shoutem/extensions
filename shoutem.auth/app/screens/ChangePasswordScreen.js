import React, { PureComponent } from 'react';
import { Alert, KeyboardAvoidingView } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { I18n } from 'shoutem.i18n';
import {
  NavigationBar,
  isTabBarNavigation,
  getActiveNavigationStack,
  getActiveNavigationStackState,
} from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import {
  Screen,
  ScrollView,
  Title,
  Text,
  TextInput,
  Button,
  View,
  Keyboard,
} from '@shoutem/ui';
import { PasswordTextInput } from '../components';
import { ext } from '../const';
import { errorMessages } from '../errorMessages';
import { loginRequired } from '../loginRequired';
import { resetPassword } from '../redux';

class ChangePasswordScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      verificationCode: '',
      newPassword: '',
      repeatNewPassword: '',
      verificationCodeError: null,
      newPasswordError: null,
      repeatNewPasswordError: null,
    };
  }

  handleValueChange(fieldName) {
    return value => this.setState({ [fieldName]: value });
  }

  handleChangePasswordPress() {
    const { email, resetPassword } = this.props;
    const { verificationCode, newPassword } = this.state;

    this.setState(
      {
        verificationCodeError: null,
        newPasswordError: null,
        repeatNewPasswordError: null,
      },
      () => {
        const validInputs = this.validateInputValues();

        if (validInputs) {
          resetPassword(verificationCode, email, newPassword)
            .then(() => this.showResetResultAlert(true))
            .catch(() => this.showResetResultAlert(false));
        }
      },
    );
  }

  validateInputValues() {
    const { verificationCode, newPassword, repeatNewPassword } = this.state;

    let isValid = true;

    if (_.isEmpty(verificationCode)) {
      isValid = false;

      this.setState({
        verificationCodeError: I18n.t(ext('verificationCodeErrorText')),
      });
    }

    if (newPassword.length < 6) {
      isValid = false;

      this.setState({
        newPasswordError: errorMessages.SIGNUP_PASSWORD_INVALID,
      });
    }

    if (newPassword !== repeatNewPassword) {
      isValid = false;

      this.setState({
        repeatNewPasswordError: I18n.t(ext('repeatPasswordErrorText')),
      });
    }

    if (repeatNewPassword.length < 6) {
      isValid = false;

      this.setState({
        repeatNewPasswordError: errorMessages.SIGNUP_PASSWORD_INVALID,
      });
    }

    return isValid;
  }

  showResetResultAlert(passwordChangedSuccessfully) {
    if (passwordChangedSuccessfully) {
      const { navigateToLoginScreen } = this.props;

      return Alert.alert(
        I18n.t(ext('alertSuccessTitle')),
        I18n.t(ext('alertSuccessMessage')),
        [
          {
            text: I18n.t(ext('alertConfirmButton')),
            onPress: () => navigateToLoginScreen(),
          },
        ],
      );
    }

    return Alert.alert(
      I18n.t(ext('alertErrorTitle')),
      I18n.t(ext('alertErrorMessage')),
      [{ text: I18n.t(ext('confirmButtonText')) }],
    );
  }

  render() {
    const { style, isTabBar } = this.props;
    const {
      verificationCode,
      newPassword,
      repeatNewPassword,
      verificationCodeError,
      newPasswordError,
      repeatNewPasswordError,
    } = this.state;

    const keyboardOffset = Keyboard.calculateKeyboardOffset();
    const styleName = isTabBar ? '' : 'with-notch-padding';

    return (
      <Screen styleName={styleName}>
        <NavigationBar
          title={I18n.t(ext('changePasswordNavBarTitle')).toUpperCase()}
        />
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={keyboardOffset}
          style={style.keyboardAvoidingViewContainer}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={style.textContainer}>
              <Title style={style.title}>
                {I18n.t(ext('changePasswordTitle'))}
              </Title>
              <Text style={style.description}>
                {I18n.t(ext('changePasswordDescription'))}
              </Text>
            </View>
            <View styleName="lg-gutter-horizontal">
              <Text style={style.inputCaption}>
                {I18n.t(ext('verificationCodeCaption'))}
              </Text>
              <View style={style.inputWrapper}>
                <TextInput
                  style={style.codeInput}
                  placeholder={I18n.t(ext('verificationCodeInputPlaceholder'))}
                  autoCapitalize="none"
                  errorMessage={verificationCodeError}
                  autoCorrect={false}
                  highlightOnFocus
                  keyboardAppearance="dark"
                  onChangeText={this.handleValueChange('verificationCode')}
                  returnKeyType="done"
                  value={verificationCode}
                />
              </View>
              <Text style={style.inputCaption}>
                {I18n.t(ext('newPasswordCaption'))}
              </Text>
              <View style={style.inputWrapper}>
                <PasswordTextInput
                  onChangeText={this.handleValueChange('newPassword')}
                  errorMessage={newPasswordError}
                  password={newPassword}
                />
              </View>
              <Text style={style.inputCaption}>
                {I18n.t(ext('repeatNewPasswordCaption'))}
              </Text>
              <View style={style.inputWrapper}>
                <PasswordTextInput
                  onChangeText={this.handleValueChange('repeatNewPassword')}
                  errorMessage={repeatNewPasswordError}
                  password={repeatNewPassword}
                />
              </View>
              <Button
                style={style.confirmButton}
                onPress={this.handleChangePasswordPress}
              >
                <Text>{I18n.t(ext('confirmButtonText'))}</Text>
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Screen>
    );
  }
}

ChangePasswordScreen.propTypes = {
  email: PropTypes.string.isRequired,
  style: PropTypes.object,
  resetPassword: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    isTabBar: isTabBarNavigation(state),
    activeNavigationStack: getActiveNavigationStack(state),
    activeNavigationStackState: getActiveNavigationStackState(state),
  };
};

export const mapDispatchToProps = {
  resetPassword,
};

export default loginRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('ChangePasswordScreen'))(ChangePasswordScreen)),
  false,
);
