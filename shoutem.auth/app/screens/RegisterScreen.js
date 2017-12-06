import React, {
  Component,
} from 'react';

import {
  TextInput,
  Screen,
  Divider,
  Button,
  Text,
} from '@shoutem/ui';

import {
  Alert,
} from 'react-native';

import { connect } from 'react-redux';

import _ from 'lodash';

import { getAppId } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { NavigationBar } from '@shoutem/ui/navigation';
import { navigateBack } from '@shoutem/core/navigation';

import {
  register,
  userRegistered,
} from '../redux';

import { ext } from '../const';

import { loginRequired } from '../loginRequired';
import { saveSession } from '../session';
import {
  errorMessages,
  getErrorMessage,
} from '../errorMessages';

export class RegisterScreen extends Component {
  static propTypes = {
    navigateBack: React.PropTypes.func,
    register: React.PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.performRegistration = this.performRegistration.bind(this);

    this.state = {
      email: undefined,
      username: undefined,
      password: undefined,
    };
  }

  performRegistration() {
    const { register, navigateBack } = this.props;
    const { email, username, password } = this.state;
    if (_.isEmpty(email) || _.isEmpty(username) || _.isEmpty(password)) {
      Alert.alert(I18n.t('shoutem.application.errorTitle'), errorMessages.EMPTY_FIELDS);
      return;
    }
    register(email, username, password).then(
      ({ payload }) => {
        saveSession(JSON.stringify(payload));
        userRegistered(payload);
        navigateBack();
      },
      ({ payload }) => {
        const { response } = payload;
        Alert.alert(I18n.t(ext('registrationFailedErrorTitle')), getErrorMessage(response && response.code));
      },
    );
  }

  render() {
    return (
      <Screen>
        <NavigationBar title={I18n.t(ext('registerNavBarTitle'))} />
        <Divider />
        <Divider styleName="line" />
        <TextInput
          placeholder={I18n.t(ext('emailPlaceholder'))}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          keyboardAppearance="dark"
          onChangeText={email => this.setState({ email })}
          returnKeyType="done"
        />
        <Divider styleName="line" />
        <TextInput
          placeholder={I18n.t(ext('usernamePlaceholder'))}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance="dark"
          onChangeText={username => this.setState({ username })}
          returnKeyType="done"
        />
        <Divider styleName="line" />
        <TextInput
          placeholder={I18n.t(ext('passwordPlaceholder'))}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance="dark"
          secureTextEntry
          onChangeText={password => this.setState({ password })}
          returnKeyType="done"
        />
        <Divider styleName="line" />
        <Divider />
        <Button
          styleName="full-width inflexible"
          onPress={this.performRegistration}
        >
          <Text>{I18n.t(ext('registerButton'))}</Text>
        </Button>
      </Screen>
    );
  }
}

export const mapDispatchToProps = {
  navigateBack,
  register,
  userRegistered,
};

function mapStateToProps(state) {
  return {
    user: state[ext()].user,
    appId: getAppId(),
  };
}

export default loginRequired(connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterScreen), false);
