import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Text, TouchableOpacity, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { images } from '../../assets';
import { ext } from '../../const';

export function QuantitySelector({
  count,
  style,
  onCountChange,
  disabled,
  maxCount,
  minCount,
}) {
  const [currentCount, setCurrentCount] = useState(count);

  function handleAddPress() {
    if (currentCount + 1 > maxCount) {
      return;
    }

    const newCount = currentCount + 1;

    setCurrentCount(newCount);
    onCountChange(newCount);
  }

  function handleRemovePress() {
    if (currentCount - 1 < minCount) {
      return;
    }

    const newCount = currentCount - 1;

    setCurrentCount(newCount);
    onCountChange(newCount);
  }

  return (
    <View style={style.mainContainer}>
      <Text style={style.caption}>{I18n.t(ext('quickBuyQuantity'))}</Text>
      <View style={style.container}>
        <TouchableOpacity disabled={disabled} onPress={handleRemovePress}>
          <Image source={images.remove} style={style.control} />
        </TouchableOpacity>
        <Text style={style.count}>{currentCount}</Text>
        <TouchableOpacity disabled={disabled} onPress={handleAddPress}>
          <Image source={images.add} style={style.control} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

QuantitySelector.propTypes = {
  count: PropTypes.number,
  disabled: PropTypes.bool,
  maxCount: PropTypes.number,
  minCount: PropTypes.number,
  style: PropTypes.object,
  onCountChange: PropTypes.func,
};

QuantitySelector.defaultProps = {
  count: 1,
  disabled: false,
  style: {},
  minCount: 1,
  maxCount: Number.POSITIVE_INFINITY,
  onCountChange: undefined,
};

export default connectStyle(ext('QuantitySelector'))(QuantitySelector);
