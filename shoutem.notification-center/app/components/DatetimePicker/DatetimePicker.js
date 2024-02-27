import React, { useMemo } from 'react';
import { Platform } from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
import DatePickerIOS from './DatePickerIOS';
import DatetimePickerAndroid from './DatetimePickerAndroid';

export default function DatetimePicker(props) {
  const { date, onDateSelected, isVisible, onDatepickerClose } = props;

  const today = useMemo(() => new Date(), []);

  const dateValue = useMemo(() => moment(date).toDate(), [date]);

  if (Platform.OS === 'android') {
    return (
      <DatetimePickerAndroid
        date={dateValue}
        isVisible={isVisible}
        minimumDate={today}
        onDateSelected={onDateSelected}
      />
    );
  }

  return (
    <DatePickerIOS
      date={dateValue}
      isVisible={isVisible}
      minimumDate={today}
      onDatepickerClose={onDatepickerClose}
      onDateSelected={onDateSelected}
    />
  );
}

DatetimePicker.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  isVisible: PropTypes.bool.isRequired,
  onDatepickerClose: PropTypes.func.isRequired,
  onDateSelected: PropTypes.func.isRequired,
};
