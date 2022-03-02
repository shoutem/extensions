import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Image,
  ImageBackground,
  Overlay,
  Text,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { images } from '../../assets';
import { ext, ORDER_STATUSES } from '../../const';
import { centsToDollars, formatOrderStatus } from '../../services';

const ORDER_DATE_FORMAT = 'DD/MM/YY';

export function OrderListItem({ order, onPress, style }) {
  const hasOverlay = _.size(order.skus) > 1;
  const moreProductsCount = _.size(order.skus) - 1;
  const formattedDate = moment(order.timeslot.date).format(ORDER_DATE_FORMAT);
  const dateText = `${formattedDate} • `;
  const price = `$${centsToDollars(order.subtotalPrice)}`;
  const orderStatusTextStyle =
    order.status === ORDER_STATUSES.CANCELED
      ? style.orderStatusNegative
      : style.orderStatusPositive;

  function handlePress() {
    if (onPress) {
      onPress(order.id);
    }
  }

  return (
    <TouchableOpacity style={style.container} onPress={handlePress}>
      <ImageBackground
        style={style.image}
        imageStyle={style.image}
        source={{ uri: _.head(order.skus[0].sku.product.images) }}
      >
        {hasOverlay && (
          <Overlay style={style.overlay}>
            <Text style={style.countIndicator}>{`${moreProductsCount}+`}</Text>
          </Overlay>
        )}
      </ImageBackground>
      <View style={style.contentContainer}>
        <View>
          <Text style={style.orderIdText}>{`#̨${order.id}`}</Text>
          <Text style={style.dateText}>
            {dateText}
            <Text style={[style.dateText, orderStatusTextStyle]}>
              {formatOrderStatus(order)}
            </Text>
          </Text>
        </View>
        <View styleName="horizontal v-center">
          <Text style={style.priceText}>{price}</Text>
          <Image source={images.arrowRight} style={style.icon} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

OrderListItem.propTypes = {
  order: PropTypes.object.isRequired,
  style: PropTypes.object,
  onPress: PropTypes.func,
};

OrderListItem.defaultProps = {
  style: {},
  onPress: undefined,
};

export default React.memo(connectStyle(ext('OrderListItem'))(OrderListItem));
