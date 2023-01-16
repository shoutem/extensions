import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';

function OrderTotal({ subtotal, shipping, total, style }) {
  return (
    <View style={style.container}>
      <View style={style.row}>
        <Text>{I18n.t(ext('subtotal'))}</Text>
        <Text>{subtotal}</Text>
      </View>
      <View style={style.row}>
        <Text>{I18n.t(ext('shipping'))}</Text>
        <Text>{shipping}</Text>
      </View>
      <View style={style.divider} />
      <View style={style.row}>
        <Text style={style.bold}>{I18n.t(ext('total'))}</Text>
        <Text style={style.bold}>{total}</Text>
      </View>
    </View>
  );
}

OrderTotal.propTypes = {
  shipping: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  subtotal: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
};

export default connectStyle(ext('OrderTotal'))(OrderTotal);
