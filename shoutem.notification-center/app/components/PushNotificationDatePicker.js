import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { isWeb } from 'shoutem-core';
import { ext } from '../const';
import { formatDeliveryTime } from '../services';
import { DatetimePicker } from './DatetimePicker';
import { TextInputButton } from './shared';

function PushNotificationDatePicker(props) {
  const { date, onDateSelected, style } = props;

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
      {!isWeb && (
        <TextInputButton
          label={I18n.t(ext('pushNotificationsDatePickerCaption'))}
          value={formattedDate}
          onPress={setTimePickerVisible}
        />
      )}
      {isWeb && (
        <Text style={style.webLabel}>
          {I18n.t(ext('pushNotificationsDatePickerCaption'))}
        </Text>
      )}
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
  style: PropTypes.object.isRequired,
  onDateSelected: PropTypes.func.isRequired,
};

export default React.memo(
  connectStyle(ext('PushNotificationDatePicker'))(PushNotificationDatePicker),
);
