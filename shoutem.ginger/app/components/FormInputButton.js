import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, TouchableOpacity, View } from '@shoutem/ui';
import { ext } from '../const';

function FormInputButton({ label, onPress, value, style, labelColor }) {
  const resolvedLabelStyle = useMemo(
    () => [style.label, !!labelColor && { color: labelColor }],
    [labelColor, style.label],
  );

  return (
    <TouchableOpacity onPress={onPress} style={style.container}>
      <Text style={resolvedLabelStyle}>{label}</Text>
      <View style={style.inputContainer}>
        <Text ellipsizeMode="tail" numberOfLines={1}>
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

FormInputButton.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  labelColor: PropTypes.string,
  style: PropTypes.object,
};

FormInputButton.defaultProps = {
  style: {},
  labelColor: undefined,
};

export default connectStyle(ext('FormInputButton'))(FormInputButton);
