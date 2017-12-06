import React, { Component, PropTypes } from 'react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import { Switch, FontIcon, FontIconPopover } from '@shoutem/react-web-ui';
import {
  canManuallyApproveMembers,
  areAllScreensProtected,
  isSignupEnabled,
} from '../../services';
import './style.scss';

export default class GeneralSettings extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.handleMakeAllScreensPrivateChange = this.handleMakeAllScreensPrivateChange.bind(this);
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
        canManuallyApproveMembers: canManuallyApproveMembers(nextAppSettings, appSettings),
      });
    }

    if(nextExtensionSettings !== extensionSettings) {
      this.setState({
        signupEnabled: isSignupEnabled(nextExtensionSettings, extensionSettings),
        allScreensProtected: areAllScreensProtected(nextExtensionSettings, extensionSettings),
      });
    }
  }

  handleMakeAllScreensPrivateChange() {
    const { onExtensionSettingsUpdate } = this.props;
    const { allScreensProtected } = this.state;

    const settingsPatch = {
      allScreensProtected: !allScreensProtected,
    };

    onExtensionSettingsUpdate(settingsPatch)
      .then(() => this.setState(settingsPatch));
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
    const { canManuallyApproveMembers } = this.state;

    this.props.onAppSettingsUpdate({
      manuallyApproveMembers: !canManuallyApproveMembers,
    });
  }

  render() {
    const {
      allScreensProtected,
      signupEnabled,
      canManuallyApproveMembers,
    } = this.state;

    return (
      <div className="general-settings">
        <h3>General settings</h3>
        <FormGroup>
          <ControlLabel>Allow new user registration</ControlLabel>
          <Switch
            className="general-settings__switch"
            checked={signupEnabled}
            onChange={this.handleNewUserRegistrationChange}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Manually approve new members</ControlLabel>
          <Switch
            className="general-settings__switch"
            checked={canManuallyApproveMembers}
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
        <FormGroup>
          <ControlLabel>Make all screens private</ControlLabel>
          <Switch
            className="general-settings__switch"
            onChange={this.handleMakeAllScreensPrivateChange}
            value={allScreensProtected}
          />
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
