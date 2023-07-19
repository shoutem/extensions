import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import isEmail from 'is-email';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import { Screen, Title, Text, TextInput, Button, View } from '@shoutem/ui';
import { ext } from '../const';
import { errorMessages } from '../errorMessages';
import { loginRequired } from '../loginRequired';
import { sendVerificationCodeEmail } from '../redux';

class PasswordRecoveryScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    const email = _.get(props, 'email', '');

    this.state = {
      email,
      emailError: null,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({
      title: I18n.t(ext('passwordRecoveryNavBarTitle')).toUpperCase(),
    });
  }

  handleEmailChange(email) {
    this.setState({ email });
  }

  handleSendEmailPress() {
    const { sendVerificationCodeEmail } = this.props;
    const { email } = this.state;

    this.setState({ emailError: null }, () => {
      if (!isEmail(email)) {
        return this.setState({
          emailError: errorMessages.SIGNUP_EMAIL_INVALID,
        });
      }

      return sendVerificationCodeEmail(email).then(() =>
        this.navigateToChangePasswordScreen(email),
      );
    });
  }

  navigateToChangePasswordScreen(email) {
    navigateTo(ext('ChangePasswordScreen'), { email });
  }

  render() {
    const { style } = this.props;
    const { email, emailError } = this.state;

    return (
      <Screen>
        <View style={style.textContainer}>
          <Title style={style.title}>
            {I18n.t(ext('changePasswordTitle'))}
          </Title>
          <Text style={style.description}>
            {I18n.t(ext('passwordRecoveryDescription'))}
          </Text>
        </View>
        <View styleName="lg-gutter-horizontal">
          <Text style={style.inputCaption}>
            {I18n.t(ext('emailInputCaption'))}
          </Text>
          <TextInput
            styleName="lg-gutter-right"
            style={style.emailInput}
            placeholder={I18n.t(ext('emailPlaceholder'))}
            errorMessage={emailError}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardAppearance="dark"
            keyboardType="email-address"
            onChangeText={this.handleEmailChange}
            returnKeyType="done"
            value={email}
          />
          <Button
            style={style.confirmButton}
            onPress={this.handleSendEmailPress}
          >
            <Text>{I18n.t(ext('sendEmailButtonText'))}</Text>
          </Button>
        </View>
      </Screen>
    );
  }
}

PasswordRecoveryScreen.propTypes = {
  style: PropTypes.object,
  sendVerificationCodeEmail: PropTypes.func,
};

export const mapDispatchToProps = { sendVerificationCodeEmail };

const mapStateToProps = (state, ownProps) => ({
  ...getRouteParams(ownProps),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('PasswordRecoveryScreen'))(PasswordRecoveryScreen));
