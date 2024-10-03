import React, { useCallback, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const MOMENT_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';

export default function DatetimePickerWeb(props) {
  const { date, minimumDate, onDateSelected } = props;

  const [currentDate, setCurrentDate] = useState(
    moment(date).format(MOMENT_DATETIME_FORMAT),
  );

  const handleDateChange = useCallback(
    event => {
      const datetime = event.target.value;

      const resolvedDate = moment(datetime).isBefore(moment(minimumDate))
        ? moment(minimumDate).format(MOMENT_DATETIME_FORMAT)
        : datetime;

      setCurrentDate(resolvedDate);

      onDateSelected(moment(resolvedDate).toDate());
    },
    [minimumDate, onDateSelected],
  );

  return (
    <input
      type="datetime-local"
      name="datetime"
      min={moment(minimumDate).format(MOMENT_DATETIME_FORMAT)}
      onChange={handleDateChange}
      value={currentDate}
    />
  );
}

DatetimePickerWeb.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  minimumDate: PropTypes.instanceOf(Date).isRequired,
  onDateSelected: PropTypes.func.isRequired,
};
