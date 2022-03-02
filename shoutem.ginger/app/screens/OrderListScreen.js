import React, { useEffect, useMemo } from 'react';
import { LayoutAnimation, SectionList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Screen, Text, View } from '@shoutem/ui';
import { loginRequired } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { navigateTo } from 'shoutem.navigation';
import { animations, images } from '../assets';
import { OrderListItem, PlaceholderView } from '../components';
import { ext } from '../const';
import {
  areOrdersLoading,
  getOrdersMonthlySections,
  loadOrders,
} from '../redux';

const ORDER_SECTION_TRANSLATION_KEYS = {
  thisMonth: 'orderThisMonthSectionTitle',
  pastMonth: 'orderPastMonthSectionTitle',
  older: 'orderOlderSectionTitle',
};

function OrderListScreen({ style }) {
  const dispatch = useDispatch();
  const orders = useSelector(getOrdersMonthlySections);
  const loading = useSelector(areOrdersLoading);

  useEffect(() => {
    dispatch(loadOrders());
  }, [dispatch]);

  useEffect(() => LayoutAnimation.easeInEaseOut, [loading]);

  const ordersEmpty = useMemo(
    () => _.every(orders, order => _.isEmpty(order.data)),
    [orders],
  );

  function handleOrderPress(orderId) {
    navigateTo(ext('OrderDetailsScreen'), {
      orderId,
    });
  }

  function renderSectionHeader({ section }) {
    if (_.isEmpty(section.data)) {
      return null;
    }

    return (
      <View style={style.sectionHeaderContainer}>
        <Text style={style.sectionHeaderText}>
          {I18n.t(ext(ORDER_SECTION_TRANSLATION_KEYS[section.key]))}
        </Text>
      </View>
    );
  }

  function renderOrder({ item }) {
    return <OrderListItem order={item} onPress={handleOrderPress} />;
  }

  if (loading) {
    return <LottieView source={animations.storeLoading} autoPlay loop />;
  }

  if (ordersEmpty) {
    return <PlaceholderView image={images.emptyOrders} />;
  }

  return (
    <Screen styleName="paper">
      <SectionList
        sections={orders}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderOrder}
        contentContainerStyle={style.container}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

OrderListScreen.propTypes = {
  style: PropTypes.object,
};

OrderListScreen.defaultProps = {
  style: {},
};

export default loginRequired(
  React.memo(connectStyle(ext('OrderListScreen'))(OrderListScreen)),
);
