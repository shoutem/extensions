import React, { useMemo } from 'react';
import { uses24HourClock } from 'react-native-localize';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { DateTimePicker, Text, View } from '@shoutem/ui';
import { ext } from '../const';

function DatePicker({
  label,
  onValueChanged,
  value,
  textValue,
  labelColor,
  maximumDate,
  style,
}) {
  const resolvedLabelStyle = useMemo(
    () => [style.label, !!labelColor && { color: labelColor }],
    [labelColor, style.label],
  );

  return (
    <View style={style.container}>
      <Text style={resolvedLabelStyle}>{label}</Text>
      <DateTimePicker
        is24Hour={uses24HourClock()}
        mode="date"
        onValueChanged={onValueChanged}
        style={style.datePickerButton}
        textValue={textValue}
        value={value}
        maximumDate={maximumDate}
      />
    </View>
  );
}

DatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  textValue: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  onValueChanged: PropTypes.func.isRequired,
  labelColor: PropTypes.string,
  maximumDate: PropTypes.object,
  style: PropTypes.object,
};

DatePicker.defaultProps = {
  labelColor: undefined,
  maximumDate: moment()
    .subtract(21, 'years')
    .toDate(),
  style: {},
};

export default connectStyle(ext('DatePicker'))(DatePicker);
