import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Text, TouchableOpacity, View } from '@shoutem/ui';
import { images } from '../assets';
import { ext } from '../const';

export function QuantitySelector({
  count,
  unaryCountChange,
  style,
  onCountChange,
  compact,
  disabled,
  maxCount,
  minCount,
}) {
  const addImage = compact ? images.addCompact : images.add;
  const removeImage = compact ? images.removeCompact : images.remove;

  function handleAddPress() {
    if (count + 1 > maxCount) {
      return;
    }

    const newCount = unaryCountChange ? 1 : count + 1;

    onCountChange(newCount);
  }

  function handleRemovePress() {
    if (count - 1 < minCount) {
      return;
    }

    const newCount = unaryCountChange ? -1 : count - 1;

    onCountChange(newCount);
  }

  return (
    <View style={[style.container, compact && style.containerCompact]}>
      <TouchableOpacity disabled={disabled} onPress={handleRemovePress}>
        <Image
          source={removeImage}
          style={[style.control, compact && style.controlCompact]}
        />
      </TouchableOpacity>
      <Text style={[style.count, compact && style.countCompact]}>{count}</Text>
      <TouchableOpacity disabled={disabled} onPress={handleAddPress}>
        <Image
          source={addImage}
          style={[style.control, compact && style.controlCompact]}
        />
      </TouchableOpacity>
    </View>
  );
}

QuantitySelector.propTypes = {
  compact: PropTypes.bool,
  count: PropTypes.number,
  disabled: PropTypes.bool,
  maxCount: PropTypes.number,
  minCount: PropTypes.number,
  style: PropTypes.object,
  unaryCountChange: PropTypes.bool,
  onCountChange: PropTypes.func,
};

QuantitySelector.defaultProps = {
  compact: false,
  count: 1,
  unaryCountChange: false,
  disabled: false,
  style: {},
  minCount: 1,
  maxCount: Number.POSITIVE_INFINITY,
  onCountChange: undefined,
};

export default connectStyle(ext('QuantitySelector'))(QuantitySelector);
