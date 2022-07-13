import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import i18next from 'i18next';
import autoBindReact from 'auto-bind/react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import { Switch, FontIcon, FontIconPopover } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

function canManuallyApproveMembers(nextAppSettings, appSettings) {
  const currentApproveMembers = _.get(
    appSettings,
    'manuallyApproveMembers',
    false,
  );
  return _.get(
    nextAppSettings,
    'manuallyApproveMembers',
    currentApproveMembers,
  );
}

function isSignupEnabled(nextSettings, settings) {
  const currentSignupEnabled = _.get(settings, 'signupEnabled', false);
  return _.get(nextSettings, 'signupEnabled', currentSignupEnabled);
}

export default class GeneralSettings extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
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
        manuallyApproveMembers: canManuallyApproveMembers(
          nextAppSettings,
          appSettings,
        ),
      });
    }

    if (nextExtensionSettings !== extensionSettings) {
      this.setState({
        signupEnabled: isSignupEnabled(
          nextExtensionSettings,
          extensionSettings,
        ),
      });
    }
  }

  handleNewUserRegistrationChange() {
    const { onExtensionSettingsUpdate } = this.props;
    const { signupEnabled } = this.state;

    const settingsPatch = {
      signupEnabled: !signupEnabled,
    };

    onExtensionSettingsUpdate(settingsPatch).then(() =>
      this.setState(settingsPatch),
    );
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
    onExtensionSettingsUpdate(settingsPatch).then(() =>
      this.setState(settingsPatch),
    );
  }

  render() {
    const { signupEnabled, manuallyApproveMembers } = this.state;

    return (
      <div className="general-settings">
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
        <FormGroup className="switch-form-group">
          <ControlLabel>
            {i18next.t(LOCALIZATION.FORM_ALLOW_NEW_USER_REGISTRATION_TITLE)}
          </ControlLabel>
          <Switch
            checked={signupEnabled}
            onChange={this.handleNewUserRegistrationChange}
          />
        </FormGroup>
        <FormGroup className="switch-form-group">
          <ControlLabel>
            {i18next.t(LOCALIZATION.FORM_MANUALLY_APPROVE_NEW_MEMBERS_TITLE)}
          </ControlLabel>
          <Switch
            checked={manuallyApproveMembers}
            onChange={this.handleAllowMembersChange}
          />
          <FontIconPopover
            message={i18next.t(
              LOCALIZATION.MANUALLY_APPROVE_MEMBERS_DESCRIPTION,
            )}
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
