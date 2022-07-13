import React, { PureComponent } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Screen, Subtitle, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { navigateTo } from 'shoutem.navigation';
import { SettingDetailsNavigationItem, SettingsToggle } from '../components';
import { ext } from '../const';
import {
  getDailyMessagesAppSettings,
  getNotificationSettings,
  getReminderAppSettings,
  setNotificationSettings,
} from '../redux';
import { notifications } from '../services';

export class NotificationSettingsScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    const remindMeToUseApp = _.get(
      props,
      'notificationSettings.remindMeToUseApp',
      true,
    );
    const dailyMessages = _.get(
      props,
      'notificationSettings.dailyMessages',
      true,
    );

    this.state = {
      remindMeToUseApp,
      dailyMessages,
    };
  }

  handleReminderSettingToggle() {
    const {
      notificationSettings,
      reminderAppSettings,
      setNotificationSettings,
    } = this.props;
    const { remindMeToUseApp: prevRemindMeToUseApp } = this.state;

    const remindMeToUseApp = !prevRemindMeToUseApp;
    const newNotificationSettings = {
      ...notificationSettings,
      remindMeToUseApp,
    };

    this.setState({ remindMeToUseApp }, async () => {
      setNotificationSettings(newNotificationSettings);
      notifications.cancelReminderNotifications();

      if (
        !remindMeToUseApp ||
        !reminderAppSettings ||
        !reminderAppSettings.enabled ||
        _.isEmpty(reminderAppSettings.message)
      ) {
        return;
      }

      notifications.rescheduleReminderNotifications(
        newNotificationSettings,
        reminderAppSettings,
      );
    });
  }

  handleOpenReminderSettingDetails() {
    navigateTo(ext('ReminderSettingsScreen'));
  }

  handleDailyMessagesSettingToggle(dailyMessages) {
    const { notificationSettings, setNotificationSettings } = this.props;

    const newNotificationSettings = {
      ...notificationSettings,
      dailyMessages,
    };

    this.setState({ dailyMessages }, async () => {
      setNotificationSettings(newNotificationSettings);

      if (!dailyMessages) {
        await notifications.cancelScheduledNotifications();
      }
    });
  }

  handleOpenDailyMessagesSettingsDetails() {
    navigateTo(ext('NotificationDailySettingsScreen'));
  }

  showDailyMessagesUnsubscribeAlert() {
    const { dailyMessages } = this.state;

    // User is switching it from true -> false. onChange happens before Switch value is changed
    if (dailyMessages) {
      return Alert.alert(
        I18n.t(ext('dailyMessagesAlertTitle')),
        I18n.t(ext('dailyMessagesAlertMessage')),
        [
          {
            text: I18n.t(ext('alertCancelButton')),
            onPress: () => null,
          },
          {
            text: I18n.t(ext('alertConfirmButton')),
            onPress: () =>
              this.handleDailyMessagesSettingToggle(!dailyMessages),
          },
        ],
      );
    }

    return this.handleDailyMessagesSettingToggle(true);
  }

  render() {
    const { reminderAppSettings, scheduledNotificationsEnabled } = this.props;
    const { dailyMessages, remindMeToUseApp } = this.state;

    const reminderSettingsEnabled =
      !!reminderAppSettings && reminderAppSettings.enabled;
    const resolvedStyleName = reminderSettingsEnabled ? 'xl-gutter-top' : '';

    return (
      <Screen>
        {reminderSettingsEnabled && (
          <>
            <View styleName="md-gutter">
              <Subtitle>{I18n.t(ext('reminders')).toUpperCase()}</Subtitle>
            </View>
            <SettingsToggle
              onChange={this.handleReminderSettingToggle}
              title={I18n.t(ext('reminderToggleTitle'))}
              value={remindMeToUseApp}
            />
            <SettingDetailsNavigationItem
              disabled={!remindMeToUseApp}
              onPress={this.handleOpenReminderSettingDetails}
              title={I18n.t(ext('reminderNavigationItemTitle'))}
            />
          </>
        )}
        {scheduledNotificationsEnabled && (
          <View styleName={resolvedStyleName}>
            <View styleName="md-gutter">
              <Subtitle>
                {I18n.t(ext('dailyMessagesSectionTitle')).toUpperCase()}
              </Subtitle>
            </View>
            <SettingsToggle
              onChange={this.showDailyMessagesUnsubscribeAlert}
              title={I18n.t(ext('dailyMessagesToggleTitle'))}
              value={dailyMessages}
            />
            <SettingDetailsNavigationItem
              disabled={!dailyMessages}
              onPress={this.handleOpenDailyMessagesSettingsDetails}
              title={I18n.t(ext('dailyMessagesNavigationItemTitle'))}
            />
          </View>
        )}
      </Screen>
    );
  }
}

NotificationSettingsScreen.propTypes = {
  navigateTo: PropTypes.func,
  reminderAppSettings: PropTypes.object,
  scheduledNotificationsEnabled: PropTypes.bool,
  setNotificationSettings: PropTypes.func,
  style: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const notificationSettings = getNotificationSettings(state);
  const reminderAppSettings = getReminderAppSettings(state);
  const scheduledNotificationsEnabled = getDailyMessagesAppSettings(state);

  return {
    notificationSettings,
    reminderAppSettings,
    scheduledNotificationsEnabled,
  };
}

const mapDispatchToProps = { setNotificationSettings };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('NotificationSettingsScreen'))(NotificationSettingsScreen));
