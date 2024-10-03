import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

const MOMENT_TIME_FORMAT = 'HH:mm';

function ReminderTimePickers({
  reminderTimes,
  onAddReminder,
  onReminderTimeSelected,
}) {
  const handleTimeSelected = (event, index) => {
    const time = event.target.value;

    onReminderTimeSelected(moment(time, MOMENT_TIME_FORMAT), index);
  };

  return (
    <>
      {_.map(reminderTimes, (reminderTime, index) => {
        const resolvedValue = moment(reminderTime).format(MOMENT_TIME_FORMAT);

        return (
          <View styleName="horizontal md-gutter-horizontal md-gutter-bottom">
            <View styleName="flexible md-gutter-right">
              <input
                aria-label="Time"
                type="time"
                onChange={value => handleTimeSelected(value, index)}
                value={resolvedValue}
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
};

export default connectStyle(ext('ReminderTimePickers'))(ReminderTimePickers);
