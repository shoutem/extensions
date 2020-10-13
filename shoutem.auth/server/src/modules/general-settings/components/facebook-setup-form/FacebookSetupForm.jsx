import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind';
import { LoaderContainer, Switch, FormInput } from '@shoutem/react-web-ui';
import {
  Row,
  Col,
  Button,
  ButtonToolbar,
  HelpBlock,
  ControlLabel,
  FormGroup,
} from 'react-bootstrap';
import _ from 'lodash';
import './style.scss';

export default class FacebookSetupForm extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    const { providerSettings } = this.props;
    const initialFacebookID = _.get(providerSettings, 'appId', '');
    const initialFacebookAppName = _.get(providerSettings, 'appName', '');

    this.state = {
      appId: initialFacebookID,
      appName: initialFacebookAppName,
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
    const { appId, appName } = this.state;
    const appIdError = _.isEmpty(appId) && 'Required field';
    const appNameError = _.isEmpty(appName) && 'Required field';

    this.setState({ appIdError, appNameError });
    return !appIdError && !appNameError;
  }

  saveFormData() {
    const { onSetupUpdate } = this.props;
    const { appId, appName } = this.state;

    const settingsPatch = {
      providers: {
        facebook: { appId, appName },
      },
    };

    this.setState({ submitting: true });

    return onSetupUpdate(settingsPatch)
      .then(() => this.setState({ submitting: false }))
      .catch(() => {
        this.setState({
          error: 'Something went wrong, please try again',
          submitting: false,
        });
      });
  }

  disableButton() {
    const { providerSettings } = this.props;
    const initialFacebookID = _.get(providerSettings, 'appId', '');
    const initialFacebookAppName = _.get(providerSettings, 'appName', '');
    const { appId, appName } = this.state;

    if (appName === initialFacebookAppName && appId === initialFacebookID) {
      return true;
    }

    if (appId === '' || appName === '') {
      return true;
    }

    return false;
  }

  render() {
    const { providerSettings, className } = this.props;
    const { enabled } = providerSettings;
    const {
      appId,
      appIdError,
      appName,
      appNameError,
      error,
      submitting,
    } = this.state;

    return (
      <div className={className}>
        <FormGroup>
          <ControlLabel>Facebook</ControlLabel>
          <Switch onChange={this.handleFacebookSwitchToggle} value={enabled} />
          {enabled && (
            <form className="facebook-setup-form">
              <h3>Facebook Authentication setup</h3>
              <ControlLabel>
                You will need to setup a Facebook application to enable Facebook
                login.
              </ControlLabel>
              <Row>
                <Col xs={6}>
                  <FormInput
                    elementId="facebookAppId"
                    error={appIdError}
                    name="App ID"
                    onChange={this.handleAppIdChange}
                    value={appId}
                  />
                </Col>
                <Col xs={6}>
                  <FormInput
                    elementId="facebookAppName"
                    error={appNameError}
                    name="App Name"
                    onChange={this.handleAppNameChange}
                    value={appName}
                  />
                </Col>
              </Row>
              <ButtonToolbar>
                <Button
                  bsStyle="primary"
                  disabled={this.disableButton()}
                  onClick={this.handleSaveClick}
                >
                  <LoaderContainer isLoading={submitting}>Save</LoaderContainer>
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
  changeAppleClientID: PropTypes.func,
  changeFacebookAppID: PropTypes.func,
  className: PropTypes.string,
  onSetupUpdate: PropTypes.func,
  providerSettings: PropTypes.object,
};
