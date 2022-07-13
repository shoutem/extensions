import React from 'react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { RadioSelector } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default function NotificationSettings({
  onReminderMessageChange,
  onScheduledNotificationsToggle,
  onToggleReminder,
  reminder,
  scheduledNotificationsEnabled,
}) {
  const REMINDER_OPTIONS = [
    {
      value: true,
      label: i18next.t(LOCALIZATION.ENABLED_LABEL),
    },
    {
      value: false,
      label: i18next.t(LOCALIZATION.DISABLED_LABEL),
    },
  ];

  const SCHEDULED_NOTIFICATIONS_OPTIONS = [
    {
      value: true,
      label: i18next.t(LOCALIZATION.ENABLED_LABEL),
    },
    {
      value: false,
      label: i18next.t(LOCALIZATION.DISABLED_LABEL),
    },
  ];

  return (
    <>
      <h3>{i18next.t(LOCALIZATION.PN_SETTINGS_TITLE)}</h3>
      <FormGroup>
        <ControlLabel>{i18next.t(LOCALIZATION.REMINDER_LABEL)}</ControlLabel>
        <RadioSelector
          className="notification-settings__radio-selector"
          groupName="reminder"
          options={REMINDER_OPTIONS}
          activeValue={reminder.enabled}
          onSelect={onToggleReminder}
        />
      </FormGroup>
      <FormGroup className="notification-settings__form-message-margin">
        <ControlLabel>
          {i18next.t(LOCALIZATION.REMINDER_MESSAGE_LABEL)}
        </ControlLabel>
        <FormControl
          disabled={!reminder.enabled}
          onChange={onReminderMessageChange}
          value={reminder.message}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>
          {i18next.t(LOCALIZATION.SCHEDULED_NOTIFICATIONS_LABEL)}
        </ControlLabel>
        <RadioSelector
          className="notification-settings__radio-selector"
          groupName="scheduled-notifications"
          options={SCHEDULED_NOTIFICATIONS_OPTIONS}
          activeValue={scheduledNotificationsEnabled}
          onSelect={onScheduledNotificationsToggle}
        />
      </FormGroup>
    </>
  );
}

NotificationSettings.propTypes = {
  onReminderMessageChange: PropTypes.func,
  onScheduledNotificationsToggle: PropTypes.func,
  onToggleReminder: PropTypes.func,
  reminder: PropTypes.object,
  scheduledNotificationsEnabled: PropTypes.bool,
};
