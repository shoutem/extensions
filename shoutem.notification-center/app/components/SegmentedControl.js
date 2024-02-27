import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text } from '@shoutem/ui';
import { ext } from '../const';

function SegmentedControl(props) {
  const { activeOption, disabled, onOptionPress, options, style } = props;

  function renderOption(option) {
    const isActive = activeOption === option;
    const resolvedOptionStyle = [
      style.option,
      isActive && style.active,
      isActive && disabled && style.disabled,
    ];
    const resolvedTextStyle = [
      style.title,
      isActive && style.activeTitle,
      isActive && disabled && style.textDisabled,
    ];

    const handlePress = () => onOptionPress(option);

    return (
      <TouchableOpacity
        key={option}
        activeOpacity={0.75}
        disabled={disabled}
        style={resolvedOptionStyle}
        onPress={handlePress}
      >
        <Text bold style={resolvedTextStyle}>
          {option}
        </Text>
      </TouchableOpacity>
    );
  }

  return <View style={style.container}>{_.map(options, renderOption)}</View>;
}

SegmentedControl.propTypes = {
  activeOption: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  onOptionPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

SegmentedControl.defaultProps = {
  disabled: false,
  style: {},
};

export default React.memo(
  connectStyle(ext('SegmentedControl'))(SegmentedControl),
);
