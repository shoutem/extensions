import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Image, Row, Text, TouchableOpacity, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { images as imageAssets } from '../../assets';
import { ext } from '../../const';
import {
  formatOrderStatus,
  getOrderCoverImage,
  isOrderPaid,
} from '../../services';

function OrderListItem({ order, onPress, style }) {
  const { orderNumber, financialStatus, totalPriceV2 } = order;

  const orderImage = useMemo(() => ({ uri: getOrderCoverImage(order) }), [
    order,
  ]);

  const statusStyle = useMemo(
    () => [
      style.orderStatus,
      isOrderPaid(order.financialStatus) && style.paidStatus,
    ],
    [order.financialStatus, style],
  );

  const status = useMemo(() => formatOrderStatus(financialStatus), [
    financialStatus,
  ]);

  return (
    <TouchableOpacity onPress={onPress} key={orderNumber}>
      <Row style={style.container}>
        <Image
          style={style.image}
          source={orderImage}
          resizeMode="cover"
          defaultSource={imageAssets.fallback}
        />
        <View style={style.mainContainer}>
          <View style={style.orderContainer}>
            <Text>
              {I18n.t(ext('order'))}: {orderNumber}
            </Text>
            <Text style={style.price}>{totalPriceV2.displayValue}</Text>
            <Text style={statusStyle}>
              {I18n.t(ext('status'))}: {status}
            </Text>
          </View>
          <Icon
            name="right-arrow"
            width={style.iconSize}
            height={style.iconSize}
            style={style.icon}
          />
        </View>
      </Row>
    </TouchableOpacity>
  );
}

OrderListItem.propTypes = {
  order: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default connectStyle(ext('OrderListItem'))(OrderListItem);
