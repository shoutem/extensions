import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { NavigationBar } from '@shoutem/ui/navigation';
import { navigateBack } from '@shoutem/core/navigation';
import { Screen, Spinner } from '@shoutem/ui';

import { getAppId } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';

import RegisterForm from '../components/RegisterForm';
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

const AUTH_ERROR = 'auth_auth_notAuthorized_userAuthenticationError';

export class RegisterScreen extends PureComponent {
  static propTypes = {
    navigateBack: PropTypes.func,
    register: PropTypes.func,
    manualApprovalActive: PropTypes.bool,
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
    const { manualApprovalActive } = this.props;
    const { response } = payload;

    this.setState({ inProgress: false });

    const code = _.get(response, 'errors[0].code');
    const errorCode = getErrorCode(code);
    const errorMessage = getErrorMessage(errorCode);

    if (code === AUTH_ERROR && manualApprovalActive) {
      Alert.alert(I18n.t(ext('manualApprovalTitle')), I18n.t(ext('manualApprovalMessage')));
    }
    else {
      Alert.alert(I18n.t(ext('registrationFailedErrorTitle')), errorMessage);
    }
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
