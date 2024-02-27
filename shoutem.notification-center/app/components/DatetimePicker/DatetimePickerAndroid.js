import React, { useCallback, useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import PropTypes from 'prop-types';

export default function DatetimePickerAndroid(props) {
  const { date, isVisible, minimumDate, onDateSelected } = props;

  const [currentDate, setCurrentDate] = useState(date);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  useEffect(() => {
    if (isVisible && !isTimePickerVisible && !isDatePickerVisible) {
      setIsDatePickerVisible(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const onDateChange = useCallback(
    (_event, selectedDate) => {
      setIsDatePickerVisible(false);

      // If user presses cancel, dismiss all pickers
      if (!selectedDate) {
        return onDateSelected(null);
      }

      const resolvedDate = selectedDate ?? currentDate;
      setCurrentDate(moment(resolvedDate).toDate());

      return setIsTimePickerVisible(true);
    },
    [currentDate, onDateSelected],
  );

  const onTimeChange = useCallback(
    (_event, selectedDate) => {
      const resolvedDate = selectedDate ?? currentDate;

      // After picking time, only use hour & minutes
      // instead of overriding previously selected date
      const hour = moment(resolvedDate).hour();
      const minutes = moment(resolvedDate).minute();
      const finalDate = moment(currentDate)
        .hour(hour)
        .minute(minutes)
        .toDate();

      onDateSelected(finalDate);
      setIsTimePickerVisible(false);
    },
    [currentDate, onDateSelected],
  );

  return (
    <>
      {isDatePickerVisible && (
        <DateTimePicker
          is24Hour={false}
          minimumDate={minimumDate}
          mode="date"
          value={date}
          onChange={onDateChange}
        />
      )}
      {isTimePickerVisible && (
        <DateTimePicker
          is24Hour={false}
          mode="time"
          value={date}
          onChange={onTimeChange}
        />
      )}
    </>
  );
}

DatetimePickerAndroid.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  isVisible: PropTypes.bool.isRequired,
  minimumDate: PropTypes.instanceOf(Date).isRequired,
  onDateSelected: PropTypes.func.isRequired,
};
