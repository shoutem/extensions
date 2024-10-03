import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { ChevronDown } from '../../assets';
import { ext } from '../../const';

function TextInputButton(props) {
  const { errorMessage, label, onPress, value, style } = props;

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View style={style.textInputContainer}>
        {label && <Text style={style.label}>{label}</Text>}
        <View style={style.textInput}>
          <View style={style.row}>
            <Text style={style.value}>{value}</Text>
            <ChevronDown width={24} height={24} />
          </View>
        </View>
      </View>
      {errorMessage && <Text style={style.error}>{errorMessage}</Text>}
    </TouchableOpacity>
  );
}

TextInputButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  style: PropTypes.object,
  value: PropTypes.string,
};

TextInputButton.defaultProps = {
  errorMessage: '',
  label: null,
  value: '',
  style: {},
};

export default connectStyle(ext('TextInputButton'))(TextInputButton);
