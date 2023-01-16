/* eslint-disable react/jsx-wrap-multilines */
import React, { Component } from 'react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FontIcon, FontIconPopover, Switch } from '@shoutem/react-web-ui';
import MessageWithLink from '../../../../components/message-with-link';
import LOCALIZATION from './localization';
import './style.scss';

const SUPPORT_ARTICLE_LINK =
  'https://shoutem.com/support/getting-started-facebook-integration/';

function canManuallyApproveMembers(prevAppSettings, appSettings) {
  const prevApproveMembers = _.get(
    prevAppSettings,
    'manuallyApproveMembers',
    false,
  );

  return _.get(appSettings, 'manuallyApproveMembers', prevApproveMembers);
}

function isSignupEnabled(prevSettings, settings) {
  const prevSignupEnabled = _.get(prevSettings, 'signupEnabled', true);

  return _.get(settings, 'signupEnabled', prevSignupEnabled);
}

function isTrackFbsdkEventsEnabled(prevSettings, settings) {
  const prevTrackFbsdkEvents = _.get(prevSettings, 'trackFbsdkEvents', false);

  return _.get(settings, 'trackFbsdkEvents', prevTrackFbsdkEvents);
}

export default class GeneralSettings extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      manuallyApproveMembers: false,
      signupEnabled: true,
      trackFbsdkEvents: false,
    };
  }

  componentDidMount() {
    this.checkData();
  }

  componentDidUpdate(prevProps) {
    this.checkData(prevProps);
  }

  checkData(prevProps = {}) {
    const { appSettings, extensionSettings } = this.props;
    const {
      appSettings: prevAppSettings,
      extensionSettings: prevExtensionSettings,
    } = prevProps;

    if (appSettings !== prevAppSettings) {
      this.setState({
        manuallyApproveMembers: canManuallyApproveMembers(
          prevAppSettings,
          appSettings,
        ),
      });
    }

    if (extensionSettings !== prevExtensionSettings) {
      this.setState({
        signupEnabled: isSignupEnabled(
          prevExtensionSettings,
          extensionSettings,
        ),
        trackFbsdkEvents: isTrackFbsdkEventsEnabled(
          prevExtensionSettings,
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
    const { onAppSettingsUpdate, onExtensionSettingsUpdate } = this.props;
    const { manuallyApproveMembers } = this.state;

    const settingsPatch = {
      manuallyApproveMembers: !manuallyApproveMembers,
    };

    onAppSettingsUpdate({
      manuallyApproveMembers: !manuallyApproveMembers,
    });
    onExtensionSettingsUpdate(settingsPatch).then(() =>
      this.setState(settingsPatch),
    );
  }

  handleTrackFbsdkEventsChange() {
    const { onAppSettingsUpdate, onExtensionSettingsUpdate } = this.props;
    const { trackFbsdkEvents } = this.state;

    const settingsPatch = {
      trackFbsdkEvents: !trackFbsdkEvents,
    };

    onAppSettingsUpdate({
      trackFbsdkEvents: !trackFbsdkEvents,
    });
    onExtensionSettingsUpdate(settingsPatch).then(() =>
      this.setState(settingsPatch),
    );
  }

  render() {
    const {
      signupEnabled,
      trackFbsdkEvents,
      manuallyApproveMembers,
    } = this.state;

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
        <FormGroup className="switch-form-group">
          <ControlLabel>
            {i18next.t(LOCALIZATION.FORM_ENABLE_FBSDK_EVENT_TRACKING)}
          </ControlLabel>
          <Switch
            checked={trackFbsdkEvents}
            onChange={this.handleTrackFbsdkEventsChange}
          />
          <FontIconPopover
            delayHide={2000}
            hideOnMouseLeave={false}
            message={
              <MessageWithLink
                link={SUPPORT_ARTICLE_LINK}
                linkText={i18next.t(LOCALIZATION.TRACK_FBSDK_EVENTS_LEARN_MORE)}
                message={i18next.t(LOCALIZATION.TRACK_FBSDK_EVENTS_DESCRIPTION)}
              />
            }
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
  onAppSettingsUpdate: PropTypes.func.isRequired,
  onExtensionSettingsUpdate: PropTypes.func.isRequired,
  appSettings: PropTypes.object,
  extensionSettings: PropTypes.object,
};

GeneralSettings.defaultProps = {
  appSettings: undefined,
  extensionSettings: undefined,
};
