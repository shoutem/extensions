import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connectStyle } from '@shoutem/theme';
import { Button, Screen, ScrollView, Subtitle, Text } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { goBack, HeaderIconButton } from 'shoutem.navigation';
import { ReminderTimePickers } from '../components';
import { DEFAULT_REMINDER, ext } from '../const';
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
  const formattedReminderTimes = useMemo(() => {
    return _.map(notificationSettings.reminderTimes, reminderTime => {
      return moment(reminderTime).format();
    });
  }, []);

  const [reminderTimes, setReminderTimes] = useState(formattedReminderTimes);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderRightComponent,
    });
  }, []);

  function renderRightComponent(props) {
    return (
      <HeaderIconButton
        {...props}
        iconName="restore"
        onPress={handleRestoreDefaultReminderSettings}
        tintColor={[style.restoreIconTintColor, props?.tintColor]}
      />
    );
  }

  const handleRestoreDefaultReminderSettings = useCallback(
    () => setReminderTimes([DEFAULT_REMINDER]),
    [],
  );

  const handleAddReminderTime = useCallback(
    () =>
      setReminderTimes(prevReminderTimes => [
        ...prevReminderTimes,
        DEFAULT_REMINDER,
      ]),
    [],
  );

  const handleReminderTimeSelected = useCallback(
    (value, index) => {
      const selectedReminderTime = moment(value)
        .set({ s: 0 })
        .format();

      const newReminderTimes = [...reminderTimes];
      newReminderTimes[index] = selectedReminderTime;

      setReminderTimes(newReminderTimes);
    },
    [reminderTimes],
  );

  const handleConfirm = useCallback(() => {
    const newSettings = {
      ...notificationSettings,
      reminderTimes,
    };

    setNotificationSettings(newSettings);

    notifications.rescheduleReminderNotifications(newSettings, reminder);

    goBack();
  }, [notificationSettings, reminder, reminderTimes, setNotificationSettings]);

  return (
    <Screen styleName="paper">
      <ScrollView>
        <Subtitle styleName="xl-gutter" style={style.subtitle}>
          {I18n.t(ext('reminderSettingDescription'))}
        </Subtitle>
        <Text
          styleName="xl-gutter-top lg-gutter-bottom h-center"
          style={style.subtitle}
        >
          {I18n.t(ext('timePickerDescription'))}
        </Text>
        <ReminderTimePickers
          reminderTimes={reminderTimes}
          onAddReminder={handleAddReminderTime}
          onReminderTimeSelected={handleReminderTimeSelected}
        />
        <Button style={style.confirmButton} onPress={handleConfirm}>
          <Text>{I18n.t(ext('confirmButtonTitle')).toUpperCase()}</Text>
        </Button>
      </ScrollView>
    </Screen>
  );
}

ReminderSettingsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  notificationSettings: PropTypes.object.isRequired,
  reminder: PropTypes.object.isRequired,
  setNotificationSettings: PropTypes.func.isRequired,
  style: PropTypes.object,
};

ReminderSettingsScreen.defaultProps = {
  style: {},
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
