import PropTypes from 'prop-types';
import React, {
  Component,
} from 'react';

import {
  Screen,
  Spinner,
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
  getErrorCode,
  getErrorMessage,
} from '../errorMessages';
import RegisterForm from '../components/RegisterForm';

export class RegisterScreen extends Component {
  static propTypes = {
    navigateBack: PropTypes.func,
    register: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    
    this.performRegistration = this.performRegistration.bind(this);
    this.finishRegistration = this.handleRegistrationSuccess.bind(this);
    this.handleRegistrationFailed = this.handleRegistrationFailed.bind(this);
    this.handleRegistrationSuccess = this.handleRegistrationSuccess.bind(this);

    this.state = {
      inProgress: false,
    };
  }

  handleRegistrationSuccess({ payload }) {
    saveSession(JSON.stringify(payload));
    userRegistered(payload);

    this.setState({ inProgress: false });
    this.props.navigateBack();
  }

  handleRegistrationFailed({ payload }) {
    const { response } = payload;

    this.setState({ inProgress: false });

    const code = _.get(response, 'errors[0].code');
    const errorCode = getErrorCode(code);
    const errorMessage = getErrorMessage(errorCode);

    Alert.alert(I18n.t(ext('registrationFailedErrorTitle')), errorMessage);
  }

  performRegistration(email, username, password) {
    this.setState({ inProgress: true });

    this.props.register(email, username, password)
      .then(this.handleRegistrationSuccess)
      .catch(this.handleRegistrationFailed);
  }

  render() {
    const { inProgress } = this.state;

    if (inProgress) {
      return (
        <Screen>
          <NavigationBar title={I18n.t(ext('registerNavBarTitle'))} />
          <Spinner styleName="xl-gutter-top" />
        </Screen>
      );
    }

    return (
      <Screen>
        <NavigationBar title={I18n.t(ext('registerNavBarTitle'))} />
        <RegisterForm onSubmit={this.performRegistration} />
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
