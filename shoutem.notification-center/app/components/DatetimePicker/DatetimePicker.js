import React, { useMemo } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { isAndroid, isWeb } from 'shoutem-core';
import DatePickerIOS from './DatePickerIOS';
import DatetimePickerAndroid from './DatetimePickerAndroid';
import DatetimePickerWeb from './DateTimePickerWeb';

export default function DatetimePicker(props) {
  const { date, onDateSelected, isVisible, onDatepickerClose } = props;

  const today = useMemo(() => new Date(), []);

  const dateValue = useMemo(() => moment(date).toDate(), [date]);

  if (isWeb) {
    return (
      <DatetimePickerWeb
        date={dateValue}
        minimumDate={today}
        onDateSelected={onDateSelected}
      />
    );
  }

  if (isAndroid) {
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
