import React from 'react';
import { uses24HourClock } from 'react-native-localize';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, DateTimePicker, Icon, Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

function ReminderTimePickers({
  reminderTimes,
  onAddReminder,
  onReminderTimeSelected,
  style,
}) {
  return (
    <>
      {_.map(reminderTimes, (reminderTime, index) => {
        const reminderTimeTextValue = moment(reminderTime).format('h:mm A');

        return (
          <View styleName="horizontal md-gutter-horizontal md-gutter-bottom">
            <View styleName="flexible md-gutter-right">
              <DateTimePicker
                is24Hour={uses24HourClock()}
                mode="time"
                style={style.timePickerButton}
                textValue={reminderTimeTextValue}
                value={moment(reminderTime).toDate()}
                onValueChanged={value => onReminderTimeSelected(value, index)}
              />
            </View>
          </View>
        );
      })}
      <Button styleName="md-gutter-top clear" onPress={onAddReminder}>
        <Icon name="clock" />
        <Text>{I18n.t(ext('addAdditionalReminder'))}</Text>
      </Button>
    </>
  );
}

ReminderTimePickers.propTypes = {
  reminderTimes: PropTypes.array.isRequired,
  onAddReminder: PropTypes.func.isRequired,
  onReminderTimeSelected: PropTypes.func.isRequired,
  style: PropTypes.object,
};

ReminderTimePickers.defaultProps = {
  style: {},
};

export default connectStyle(ext('ReminderTimePickers'))(ReminderTimePickers);
