import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { formatDeliveryTime } from '../services';
import { DatetimePicker } from './DatetimePicker';
import { TextInputButton } from './shared';

function PushNotificationDatePicker(props) {
  const { date, onDateSelected } = props;

  const [formattedDate, setFormattedDate] = useState(formatDeliveryTime(date));
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const setTimePickerVisible = useCallback(
    () => setIsDatePickerVisible(true),
    [],
  );

  const hideTimePicker = useCallback(() => setIsDatePickerVisible(false), []);

  const handleDateSelected = selectedDate => {
    if (!selectedDate) {
      return setIsDatePickerVisible(false);
    }

    onDateSelected(selectedDate);

    setFormattedDate(formatDeliveryTime(selectedDate));

    return setIsDatePickerVisible(false);
  };

  return (
    <>
      <TextInputButton
        label={I18n.t(ext('pushNotificationsDatePickerCaption'))}
        value={formattedDate}
        onPress={setTimePickerVisible}
      />
      <DatetimePicker
        date={date}
        isVisible={isDatePickerVisible}
        onDatepickerClose={hideTimePicker}
        onDateSelected={handleDateSelected}
      />
    </>
  );
}

PushNotificationDatePicker.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onDateSelected: PropTypes.func.isRequired,
};

export default React.memo(PushNotificationDatePicker);
