import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { ControlLabel, FormGroup } from 'react-bootstrap';
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

export default class GeneralSettings extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
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
      });
    }
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

    return (
      <div className="general-settings">
        <h3>General settings</h3>
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
