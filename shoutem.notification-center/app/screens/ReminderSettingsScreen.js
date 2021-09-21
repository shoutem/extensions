import React, { useState, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { uses24HourClock } from 'react-native-localize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  DateTimePicker,
  Screen,
  Subtitle,
  Text,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { goBack, HeaderIconButton } from 'shoutem.navigation';
import { ext, DEFAULT_REMINDER } from '../const';
import {
  getNotificationSettings,
  getReminderAppSettings,
  setNotificationSettings,
} from '../redux';
import { notifications } from '../services';

function ReminderSettingsScreen({
  navigation,
  notificationSettings,
  reminder,
  setNotificationSettings,
  style,
}) {
  const formattedReminderAt = moment(notificationSettings?.reminderAt).format();

  const [reminderAt, setReminderAt] = useState(formattedReminderAt);

  function handleRestoreDefaultTimeframe() {
    setReminderAt(DEFAULT_REMINDER);
  }

  function renderRightComponent(props) {
    return (
      <HeaderIconButton
        {...props}
        iconName="restore"
        onPress={handleRestoreDefaultTimeframe}
      />
    );
  }

  useEffect(() => {
    navigation.setOptions({
      title: I18n.t(ext('reminderSettingsTitle')).toUpperCase(),
      headerRight: renderRightComponent,
    });
  }, []);

  function handleReminderTimeSelected(value) {
    const reminderAt = moment(value)
      .set({ s: 0 })
      .format();

    setReminderAt(reminderAt);
  }

  async function handleConfirm() {
    const newSettings = {
      ...notificationSettings,
      reminderAt,
    };

    setNotificationSettings(newSettings);
    await notifications.scheduleReminderNotifications(
      reminder.message,
      reminderAt,
    );
    goBack();
  }

  const reminderAtTextValue = moment(reminderAt).format('h:mm A');

  return (
    <Screen styleName="paper">
      <Subtitle styleName="xl-gutter" style={style.subtitle}>
        {I18n.t(ext('reminderSettingDescription'))}
      </Subtitle>
      <Text
        styleName="xl-gutter-top lg-gutter-bottom h-center"
        style={style.subtitle}
      >
        {I18n.t(ext('timePickerDescription'))}
      </Text>
      <View styleName="horizontal md-gutter-horizontal">
        <View styleName="flexible md-gutter-right">
          <Text styleName="sm-gutter-bottom">
            {I18n.t(ext('reminderMeAt'))}
          </Text>
          <DateTimePicker
            is24Hour={uses24HourClock()}
            mode="time"
            onValueChanged={handleReminderTimeSelected}
            style={style.timePickerButton}
            textValue={reminderAtTextValue}
            value={moment(reminderAt).toDate()}
          />
        </View>
      </View>
      <Button style={style.confirmButton} onPress={handleConfirm}>
        <Text>{I18n.t(ext('confirmButtonTitle')).toUpperCase()}</Text>
      </Button>
    </Screen>
  );
}

ReminderSettingsScreen.propTypes = {
  navigation: PropTypes.object,
  notificationSettings: PropTypes.object,
  reminder: PropTypes.object,
  setNotificationSettings: PropTypes.func,
  style: PropTypes.object,
};

function mapStateToProps(state) {
  const notificationSettings = getNotificationSettings(state);
  const reminder = getReminderAppSettings(state);

  return { notificationSettings, reminder };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setNotificationSettings }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ReminderSettingsScreen'))(ReminderSettingsScreen));
