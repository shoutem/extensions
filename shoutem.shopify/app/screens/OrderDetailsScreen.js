import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ScrollView, View } from '@shoutem/ui';
import { loginRequired } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import {
  DeliveryAddress,
  OrderHeader,
  OrderItems,
  OrderTotal,
} from '../components/order';
import { ext } from '../const';
import { actions, selectors } from '../redux';
import { formatOrderStatus, isOrderPaid } from '../services';

function OrderDetailsScreen({
  route: {
    params: { orderNumber: orderId },
  },
  style,
}) {
  const dispatch = useDispatch();

  const order = useSelector(state => selectors.getOrderById(state, orderId));
  const {
    orderNumber,
    name,
    financialStatus,
    totalPriceV2,
    processedAt,
    lineItems,
    lineItemsPageInfo,
    currentSubtotalPrice,
    totalShippingPriceV2,
    shippingAddress,
  } = order;

  const handleLoadMoreItems = useCallback(() => {
    if (lineItemsPageInfo.hasNextPage) {
      return dispatch(actions.loadOrderByName(name));
    }

    return null;
  }, [dispatch, lineItemsPageInfo.hasNextPage, name]);

  return (
    <ScrollView style={style.screen}>
      <View style={style.paddedContainer}>
        <OrderHeader
          icon="shopify-order-receipt"
          title={I18n.t(ext('orderNumber'))}
          value={_.toString(orderNumber)}
        />
        <OrderHeader
          icon="shopify-order-date"
          title={I18n.t(ext('orderDate'))}
          value={moment(processedAt).format('ddd, MMM D YYYY')}
        />
        <OrderHeader
          icon="shopify-order-status"
          title={I18n.t(ext('status'))}
          value={formatOrderStatus(financialStatus)}
          secondary={isOrderPaid(financialStatus)}
        />
        <OrderItems items={lineItems} onEndReached={handleLoadMoreItems} />
        <OrderTotal
          subtotal={currentSubtotalPrice.displayValue}
          shipping={totalShippingPriceV2.displayValue}
          total={totalPriceV2.displayValue}
        />
      </View>
      <DeliveryAddress address={shippingAddress} />
    </ScrollView>
  );
}

OrderDetailsScreen.propTypes = {
  route: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
};

export default loginRequired(
  connectStyle(ext('OrderDetailsScreen'))(OrderDetailsScreen),
);
