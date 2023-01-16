import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FormInput, LoaderContainer, Switch } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

const DEFAULT_KEYSTORE_HASH = 'ga0RGNYHvNM5d0SLGQfpQWAPGJ8=';

export default class FacebookSetupForm extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    const {
      providerSettings: {
        appId: initialFacebookID = '',
        appName: initialFacebookAppName = '',
        clientToken: initialFacebookClientToken = '',
      },
    } = this.props;

    this.state = {
      appId: initialFacebookID,
      appName: initialFacebookAppName,
      clientToken: initialFacebookClientToken,
      appIdError: null,
      appNameError: null,
      submitting: false,
      error: null,
    };
  }

  handleAppIdChange(event) {
    this.setState({ appId: event.target.value });
  }

  handleAppNameChange(event) {
    this.setState({ appName: event.target.value });
  }

  handleClientTokenChange(event) {
    this.setState({ clientToken: event.target.value });
  }

  handleFacebookSwitchToggle() {
    const { providerSettings, onSetupUpdate, changeAppleClientID } = this.props;
    const enabled = _.get(providerSettings, 'enabled', false);

    const settingsPatch = {
      providers: {
        facebook: { enabled: !enabled },
        ...(!enabled && { apple: { enabled: true } }),
      },
    };

    if (!enabled) {
      changeAppleClientID();
    }

    onSetupUpdate(settingsPatch);
  }

  handleSaveClick() {
    const { appId } = this.state;
    const { changeFacebookAppID } = this.props;

    const formValid = this.validateForm();
    if (!formValid) {
      return;
    }

    this.saveFormData();
    changeFacebookAppID(appId);
  }

  validateForm() {
    const { appId, appName, clientToken } = this.state;

    const appIdError =
      _.isEmpty(appId) && i18next.t(LOCALIZATION.REQUIRED_FIELD_MESSAGE);
    const appNameError =
      _.isEmpty(appName) && i18next.t(LOCALIZATION.REQUIRED_FIELD_MESSAGE);
    const clientTokenError =
      _.isEmpty(clientToken) && i18next.t(LOCALIZATION.REQUIRED_FIELD_MESSAGE);

    this.setState({ appIdError, appNameError, clientTokenError });
    return !appIdError && !appNameError && !clientTokenError;
  }

  saveFormData() {
    const { onSetupUpdate } = this.props;
    const { appId, appName, clientToken } = this.state;

    const settingsPatch = {
      providers: {
        facebook: { appId, appName, clientToken },
      },
    };

    this.setState({ submitting: true });

    return onSetupUpdate(settingsPatch)
      .then(() => this.setState({ submitting: false }))
      .catch(() => {
        this.setState({
          error: i18next.t(LOCALIZATION.ERROR_MESSAGE),
          submitting: false,
        });
      });
  }

  disableButton() {
    const {
      providerSettings: {
        appId: initialFacebookID = '',
        appName: initialFacebookAppName = '',
        clientToken: initialFacebookClientToken = '',
      },
    } = this.props;
    const { appId, appName, clientToken } = this.state;

    if (
      appName === initialFacebookAppName &&
      appId === initialFacebookID &&
      clientToken === initialFacebookClientToken
    ) {
      return true;
    }

    if (appId === '' || appName === '' || clientToken === '') {
      return true;
    }

    return false;
  }

  render() {
    const {
      className,
      providerSettings: { enabled },
      trackFbsdkEvents,
    } = this.props;
    const {
      appId,
      appIdError,
      appName,
      appNameError,
      clientToken,
      clientTokenError,
      error,
      submitting,
    } = this.state;

    return (
      <div className={className}>
        <FormGroup>
          <ControlLabel>
            {i18next.t(LOCALIZATION.FORM_FACEBOOK_TITLE)}
          </ControlLabel>
          <Switch onChange={this.handleFacebookSwitchToggle} value={enabled} />
          {(enabled || trackFbsdkEvents) && (
            <form className="facebook-setup-form">
              <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
              <ControlLabel>
                {i18next.t(LOCALIZATION.FORM_SETUP_FACEBOOK_TITLE)}
              </ControlLabel>
              <FormInput
                elementId="facebookAppId"
                error={appIdError}
                name={i18next.t(LOCALIZATION.FORM_APP_ID_TITLE)}
                onChange={this.handleAppIdChange}
                value={appId}
              />
              <FormInput
                elementId="facebookAppName"
                error={appNameError}
                name={i18next.t(LOCALIZATION.FORM_APP_NAME_TITLE)}
                onChange={this.handleAppNameChange}
                value={appName}
              />
              <FormInput
                elementId="clientToken"
                error={clientTokenError}
                name={i18next.t(LOCALIZATION.FORM_CLIENT_TOKEN_TITLE)}
                onChange={this.handleClientTokenChange}
                value={clientToken}
              />
              <FormInput
                disabled
                name={i18next.t(LOCALIZATION.KEYPASS_HASH_TITLE)}
                value={DEFAULT_KEYSTORE_HASH}
              />
              <ButtonToolbar>
                <Button
                  bsStyle="primary"
                  disabled={this.disableButton()}
                  onClick={this.handleSaveClick}
                >
                  <LoaderContainer isLoading={submitting}>
                    {i18next.t(LOCALIZATION.BUTTON_SUBMIT_TITLE)}
                  </LoaderContainer>
                </Button>
              </ButtonToolbar>
              {error && (
                <div className="has-error">
                  <HelpBlock>{error}</HelpBlock>
                </div>
              )}
            </form>
          )}
        </FormGroup>
      </div>
    );
  }
}

FacebookSetupForm.propTypes = {
  changeAppleClientID: PropTypes.func.isRequired,
  changeFacebookAppID: PropTypes.func.isRequired,
  onSetupUpdate: PropTypes.func.isRequired,
  className: PropTypes.string,
  providerSettings: PropTypes.object,
  trackFbsdkEvents: PropTypes.bool,
};

FacebookSetupForm.defaultProps = {
  className: undefined,
  providerSettings: undefined,
  trackFbsdkEvents: false,
};
