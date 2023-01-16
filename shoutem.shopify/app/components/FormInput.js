import React from 'react';
import { Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, TextInput, View } from '@shoutem/ui';
import { ext } from '../const';

export function FormInput({
  label,
  value,
  error,
  placeholder,
  onChange,
  onPress,
  style,
}) {
  return (
    <View style={style.container}>
      <Text style={style.label}>{label}</Text>
      <Pressable style={style.textInput} onPress={onPress}>
        <TextInput
          placeholder={placeholder || label}
          editable={!onPress}
          autoCorrect={false}
          keyboardAppearance="light"
          onChangeText={onChange}
          onPressIn={onPress}
          returnKeyType="done"
          value={value}
        />
      </Pressable>
      {!!error && <Text style={style.error}>{error}</Text>}
    </View>
  );
}

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onPress: PropTypes.func,
};

FormInput.defaultProps = {
  error: null,
  placeholder: null,
  value: null,
  onPress: null,
};

export default connectStyle(ext('FormInput'))(FormInput);
