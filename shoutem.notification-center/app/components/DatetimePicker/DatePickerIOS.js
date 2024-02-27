import React, { useCallback, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';
import { Button, Modal } from '../shared';

function DatePickerIOS(props) {
  const {
    date,
    isVisible,
    minimumDate,
    onDatepickerClose,
    onDateSelected,
    style,
  } = props;

  const [currentDate, setCurrentDate] = useState(date);

  const onDateChange = useCallback(
    (_event, selectedDate) => {
      const resolvedDate = selectedDate || currentDate;
      setCurrentDate(moment(resolvedDate).toDate());
    },
    [currentDate],
  );

  const handleSubmitPress = useCallback(() => {
    onDateSelected(currentDate);
  }, [currentDate, onDateSelected]);

  const handleCancelPress = useCallback(() => {
    onDateSelected(null);
    onDatepickerClose();
  }, [onDateSelected, onDatepickerClose]);

  return (
    <Modal handleModalClose={onDatepickerClose} isVisible={isVisible}>
      <DateTimePicker
        display="inline"
        minimumDate={minimumDate}
        mode="datetime"
        themeVariant="light"
        value={currentDate}
        onChange={onDateChange}
      />
      <View style={style.buttonContainer}>
        <Button
          buttonStyle={style.cancelButton}
          title={I18n.t(ext('pushNotificationsDatePickerCancel'))}
          onPress={handleCancelPress}
        />
        <Button
          buttonStyle={style.submitButton}
          secondary
          title={I18n.t(ext('pushNotificationsDatePickerSubmit'))}
          onPress={handleSubmitPress}
        />
      </View>
    </Modal>
  );
}

DatePickerIOS.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  isVisible: PropTypes.bool.isRequired,
  minimumDate: PropTypes.instanceOf(Date).isRequired,
  onDatepickerClose: PropTypes.func.isRequired,
  onDateSelected: PropTypes.func.isRequired,
  style: PropTypes.object,
};

DatePickerIOS.defaultProps = {
  style: {},
};

export default connectStyle(ext('DatePickerIOS'))(DatePickerIOS);
