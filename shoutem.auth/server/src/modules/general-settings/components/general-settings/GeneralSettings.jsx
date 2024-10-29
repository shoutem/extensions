import React, { Component } from 'react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FontIcon, FontIconPopover, Switch } from '@shoutem/react-web-ui';
import MessageWithLink from '../../../../components/message-with-link';
import { FEATURES } from '../../../../const';
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

function isNotificationRegistrationForOwnerEnabled(prevSettings, settings) {
  const notificationEnabled = _.get(
    prevSettings,
    'sendEmailNotificationForUserRegistrationToOwner',
    false,
  );

  return _.get(
    settings,
    'sendEmailNotificationForUserRegistrationToOwner',
    notificationEnabled,
  );
}

export default class GeneralSettings extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      manuallyApproveMembers: false,
      signupEnabled: true,
      trackFbsdkEvents: false,
      sendEmailNotificationForUserRegistrationToOwner: false,
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
        sendEmailNotificationForUserRegistrationToOwner: isNotificationRegistrationForOwnerEnabled(
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

  async handleRegistrationNotificationForOwnerChange() {
    const {
      onRealmUpdate,
      onExtensionSettingsUpdate,
      onFeatureToggle,
    } = this.props;
    const { sendEmailNotificationForUserRegistrationToOwner } = this.state;

    const enable = !sendEmailNotificationForUserRegistrationToOwner;

    try {
      const settingsPatch = {
        sendEmailNotificationForUserRegistrationToOwner: enable,
      };

      const promises = [
        onFeatureToggle(FEATURES.USER_REGISTRATION_EMAIL_NOTIFICATION, enable),
        onRealmUpdate(settingsPatch),
        onExtensionSettingsUpdate(settingsPatch),
      ];

      await Promise.all(promises);
      this.setState(settingsPatch);
    } catch (error) {
      // revert changes
      const revertPatch = {
        sendEmailNotificationForUserRegistrationToOwner: !enable,
      };

      const promises = [
        onFeatureToggle(FEATURES.USER_REGISTRATION_EMAIL_NOTIFICATION, !enable),
        onRealmUpdate(revertPatch),
        onExtensionSettingsUpdate(revertPatch),
      ];

      await Promise.all(promises).catch(() => null);
      this.setState(revertPatch);
    }
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
      sendEmailNotificationForUserRegistrationToOwner,
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
        <FormGroup className="switch-form-group">
          <ControlLabel>
            {i18next.t(
              LOCALIZATION.ENABLE_EMAIL_NOTIFICATION_ABOUT_NEW_USER_REGISTRATION,
            )}
          </ControlLabel>
          <Switch
            checked={sendEmailNotificationForUserRegistrationToOwner}
            onChange={this.handleRegistrationNotificationForOwnerChange}
          />
          <FontIconPopover
            message={i18next.t(
              LOCALIZATION.ENABLE_EMAIL_NOTIFICATION_ABOUT_NEW_USER_REGISTRATION_DESCRIPTION,
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
  onAppSettingsUpdate: PropTypes.func.isRequired,
  onExtensionSettingsUpdate: PropTypes.func.isRequired,
  onFeatureToggle: PropTypes.func.isRequired,
  onRealmUpdate: PropTypes.func.isRequired,
  appSettings: PropTypes.object,
  extensionSettings: PropTypes.object,
};

GeneralSettings.defaultProps = {
  appSettings: undefined,
  extensionSettings: undefined,
};
