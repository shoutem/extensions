import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, TextInput, View } from '@shoutem/ui';
import { ext } from '../../const';

export function FormInput({
  error: { hasError, errorMessage },
  onInputChange,
  label,
  maxLength,
  multiline,
  placeholder,
  style,
  value,
}) {
  const resolvedStyle = [
    style.textInput,
    multiline && style.multilineTextInput,
  ];

  const resolvedError = useMemo(() => (hasError && errorMessage) || hasError, [
    errorMessage,
    hasError,
  ]);

  return (
    <View styleName="md-gutter-bottom">
      <Text style={style.label}>{label}</Text>
      <TextInput
        errorMessage={resolvedError}
        highlightOnFocus
        maxLength={maxLength}
        multiline={multiline}
        textAlignVertical="top"
        onChangeText={onInputChange}
        placeholder={placeholder}
        style={resolvedStyle}
        value={value}
      />
    </View>
  );
}

FormInput.propTypes = {
  error: PropTypes.shape({
    hasError: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string,
  }).isRequired,
  label: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
  multiline: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

FormInput.defaultProps = {
  placeholder: null,
};

export default connectStyle(ext('FormInput'))(FormInput);
