import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import { Button, ControlLabel, FormGroup } from 'react-bootstrap';
import { Switch, FontIcon, FontIconPopover } from '@shoutem/react-web-ui';
import './style.scss';

function canManuallyApproveMembers(nextAppSettings, appSettings) {
  const currentApproveMembers = _.get(appSettings, 'manuallyApproveMembers', false);
  return _.get(nextAppSettings, 'manuallyApproveMembers', currentApproveMembers);
}

function isSignupEnabled(nextSettings, settings) {
  const currentSignupEnabled = _.get(settings, 'signupEnabled', false);
  return _.get(nextSettings, 'signupEnabled', currentSignupEnabled);
}

function resolveAuthApiEndpoint(nextSettings, settings) {
  const currentAuthApiEndpoint = _.get(settings, 'authApiEndpoint', '');
  return _.get(nextSettings, 'authApiEndpoint', currentAuthApiEndpoint);
}

export default class GeneralSettings extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.handleUpdateApiEndpoint = this.handleUpdateApiEndpoint.bind(this);
    this.handleApiInputChange = this.handleApiInputChange.bind(this);
    this.handleNewUserRegistrationChange = this.handleNewUserRegistrationChange.bind(this);
    this.handleAllowMembersChange = this.handleAllowMembersChange.bind(this);
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { appSettings, extensionSettings } = props;
    const {
      appSettings: nextAppSettings,
      extensionSettings: nextExtensionSettings,
    } = nextProps;

    if (nextAppSettings !== appSettings) {
      this.setState({
        manuallyApproveMembers: canManuallyApproveMembers(nextAppSettings, appSettings),
      });
    }

    if (nextExtensionSettings !== extensionSettings) {
      this.setState({
        signupEnabled: isSignupEnabled(nextExtensionSettings, extensionSettings),
        authApiEndpoint: resolveAuthApiEndpoint(nextExtensionSettings, extensionSettings),
      });
    }
  }

  handleUpdateApiEndpoint(event) {
    event.preventDefault();

    const { onExtensionSettingsUpdate } = this.props;
    const { authApiEndpoint } = this.state;

    const settingsPatch = {
      authApiEndpoint,
    };

    onExtensionSettingsUpdate(settingsPatch)
      .then(() => this.setState(settingsPatch));
  }

  handleApiInputChange(event) {
    const authApiEndpoint = event.target.value;
    this.setState({ authApiEndpoint });
  }

  handleNewUserRegistrationChange() {
    const { onExtensionSettingsUpdate } = this.props;
    const { signupEnabled } = this.state;

    const settingsPatch = {
      signupEnabled: !signupEnabled,
    };

    onExtensionSettingsUpdate(settingsPatch)
      .then(() => this.setState(settingsPatch));
  }

  handleAllowMembersChange() {
    const { onExtensionSettingsUpdate } = this.props;
    const { manuallyApproveMembers } = this.state;

    const settingsPatch = {
      manuallyApproveMembers: !manuallyApproveMembers,
    };

    this.props.onAppSettingsUpdate({
      manuallyApproveMembers: !manuallyApproveMembers,
    });
    onExtensionSettingsUpdate(settingsPatch)
      .then(() => this.setState(settingsPatch))
  }

  render() {
    const {
      signupEnabled,
      manuallyApproveMembers,
    } = this.state;

    const { authApiEndpoint } = this.state;
    const endpointHasChanged = authApiEndpoint !== this.props.extensionSettings.authApiEndpoint;

    return (
      <div className="general-settings">
        <h3>General settings</h3>
        <form onSubmit={this.handleUpdateApiEndpoint}>
          <FormGroup className="switch-form-group">
            <ControlLabel>Api endpoint</ControlLabel>
            <input
              defaultValue={authApiEndpoint}
              className="form-control"
              type="text"
              autoFocus
              onChange={this.handleApiInputChange}
            />
          </FormGroup>
          <Button
            disabled={!endpointHasChanged}
            bsStyle="primary"
            onClick={this.handleUpdateApiEndpoint}
          >
            Save
          </Button>
        </form>
        <FormGroup className="switch-form-group">
          <ControlLabel>Allow new user registration</ControlLabel>
          <Switch
            checked={signupEnabled}
            onChange={this.handleNewUserRegistrationChange}
          />
        </FormGroup>
        <FormGroup className="switch-form-group">
          <ControlLabel>Manually approve new members</ControlLabel>
          <Switch
            checked={manuallyApproveMembers}
            onChange={this.handleAllowMembersChange}
          />
          <FontIconPopover
            message="New users won't be able to access the app until they are manually approved"
          >
            <FontIcon
              className="general-settings__icon-popover"
              name="info"
              size="24px"
            />
          </FontIconPopover>
        </FormGroup>
      </div>
    );
  }
}

GeneralSettings.propTypes = {
  appSettings: PropTypes.object,
  extensionSettings: PropTypes.object,
  onAppSettingsUpdate: PropTypes.func,
  onExtensionSettingsUpdate: PropTypes.func,
};
