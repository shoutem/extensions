import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Text, View } from '@shoutem/ui';
import { ext } from '../../const';

function OrderHeader({ icon, title, value, secondary, style }) {
  return (
    <View style={style.row}>
      <View style={style.iconRow}>
        <Icon
          name={icon}
          width={style.iconSize}
          height={style.iconSize}
          style={style.icon}
        />
        <Text style={style.orderDetails}>{title}:</Text>
      </View>
      <Text style={[style.value, secondary && style.secondaryText]}>
        {value}
      </Text>
    </View>
  );
}

OrderHeader.propTypes = {
  icon: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  secondary: PropTypes.bool,
};

OrderHeader.defaultProps = {
  secondary: false,
};

export default connectStyle(ext('OrderHeader'))(OrderHeader);
