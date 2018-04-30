import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  AccessToken,
  LoginManager,
} from 'react-native-fbsdk';

import {
  View,
  Caption,
  Button,
  Icon,
  Text,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';

import { ext } from '../const';
import { errorMessages } from '../errorMessages';

const { func } = PropTypes;

class FacebookButton extends Component {
  static propTypes = {
    onLoginSuccess: func,
    onLoginFailed: func,
  }

  static defaultPropTypes = {
    onLoginSuccess: _.noop,
    onLoginFailed: _.noop,
  }

  constructor(props) {
    super(props);

    this.loginOrSignup = this.loginOrSignup.bind(this);
    this.parseAccessToken = this.parseAccessToken.bind(this);
    this.openFacebookSignup = this.openFacebookSignup.bind(this);
    this.handleSignupResult = this.handleSignupResult.bind(this);
    this.handleLoginFailed = this.handleLoginFailed.bind(this);
  }

  loginOrSignup() {
    this.refreshFacebookToken()
      .then(this.parseAccessToken)
      .catch(this.openFacebookSignup);
  }

  parseAccessToken(result) {
    const { onLoginSuccess, onLoginFailed } = this.props;

    const accessToken = _.get(result, 'accessToken');
    if (!accessToken) {
      throw new Error(I18n.t(ext('tokenErrorMessage')));
    }

    onLoginSuccess(accessToken);
  }

  openFacebookSignup() {
    LoginManager.logInWithReadPermissions(['public_profile', 'email'])
      .then(this.handleSignupResult)
      .then(this.parseAccessToken)
      .catch(this.handleLoginFailed);
  }

  refreshFacebookToken() {
    return AccessToken.refreshCurrentAccessTokenAsync()
      .then(AccessToken.getCurrentAccessToken);
  }

  handleSignupResult(result) {
    if (result.isCancelled) {
      throw new Error(I18n.t(ext('loginCancelErrorMessage')));
    }

    return AccessToken.getCurrentAccessToken();
  }

  handleLoginFailed(error) {
    const { onLoginFailed } = this.props;

    const errorMessage = error.message || errorMessages.UNEXPECTED_ERROR;
    onLoginFailed(errorMessage);
  }

  render() {
    return (
      <View>
        <Caption styleName="h-center lg-gutter-vertical">
          {I18n.t(ext('socialLoginSectionTitle'))}
        </Caption>
        <Button
          onPress={this.loginOrSignup}
          styleName="full-width inflexible"
        >
          <Icon name="facebook" />
          <Text>{I18n.t(ext('facebookLogInButton'))}</Text>
        </Button>
      </View>
    );
  }
}

export default connectStyle(ext('FacebookButton'))(FacebookButton);
