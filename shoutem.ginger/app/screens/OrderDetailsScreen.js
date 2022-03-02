import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Icon,
  Image,
  Screen,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { navigateTo } from 'shoutem.navigation';
import { images } from '../assets';
import { CartListItem, OrderInformation } from '../components';
import { ext, ORDER_STATUSES } from '../const';
import { getOrder } from '../redux';
import { formatOrderStatus, isCancellable } from '../services';

const DATE_MOMENT_FORMAT = 'ddd, MMM DD YYYY';

function OrderDetailsScreen({
  route: {
    params: { orderId },
  },
  style,
}) {
  const order = useSelector(state => getOrder(state, orderId));

  const canCancel = isCancellable(order);
  const orderStatusTextStyle =
    order.status === ORDER_STATUSES.CANCELED
      ? style.sectionInfoNegative
      : style.sectionInfoPositive;

  function handleOrderCancelPress() {
    navigateTo(ext('OrderCancellationScreen'), {
      orderId,
      nextScreen: ext('OrderListScreen'),
    });
  }

  return (
    <Screen styleName="paper">
      <View style={style.container}>
        <View style={style.sectionRow}>
          <View styleName="horizontal">
            <Image source={images.note} style={style.sectionIcon} />
            <Text style={style.sectionHeading}>
              {I18n.t(ext('orderDetailsOrderNumber'))}
            </Text>
          </View>
          <Text style={style.sectionInfo}>{order.id}</Text>
        </View>
        <View style={style.sectionRow}>
          <View styleName="horizontal">
            <Icon name="ginger-clock" style={style.sectionIcon} />
            <Text style={style.sectionHeading}>
              {I18n.t(ext('orderDetailsOrderDate'))}
            </Text>
          </View>
          <Text style={style.sectionInfo}>
            {moment(order.timeslot.date).format(DATE_MOMENT_FORMAT)}
          </Text>
        </View>
        <View style={style.sectionRow}>
          <View styleName="horizontal">
            <Image source={images.infoSecondary} style={style.sectionIcon} />
            <Text style={style.sectionHeading}>
              {I18n.t(ext('orderDetailsOrderStatus'))}
            </Text>
          </View>
          <Text style={[style.sectionInfo, orderStatusTextStyle]}>
            {formatOrderStatus(order)}
          </Text>
        </View>
      </View>
      <ScrollView
        style={style.mainScrollContainer}
        contentContainerStyle={style.scrollContainer}
      >
        <Text style={style.itemsHeading}>
          {I18n.t(ext('orderDetailsOrderItems'))}
        </Text>
        {_.map(order.skus, item => (
          <CartListItem item={item} key={item.skuId} presentational />
        ))}
        <OrderInformation cartData={order} withBorder />
      </ScrollView>
      {canCancel && (
        <>
          <View style={style.separator} />
          <TouchableOpacity
            style={style.actionRow}
            onPress={handleOrderCancelPress}
          >
            <Image style={style.icon} source={images.close} />
            <Text style={style.actionText}>
              {I18n.t(ext('orderCompleteCancelOrder'))}
            </Text>
          </TouchableOpacity>
          <View style={style.separator} />
        </>
      )}
    </Screen>
  );
}

OrderDetailsScreen.propTypes = {
  route: PropTypes.object.isRequired,
  style: PropTypes.object,
};

OrderDetailsScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('OrderDetailsScreen'))(OrderDetailsScreen);
