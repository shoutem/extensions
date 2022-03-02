import React, { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Image,
  Overlay,
  Screen,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { InlineMap } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { navigateTo } from 'shoutem.navigation';
import { images } from '../assets';
import { ext } from '../const';
import { getGingerCustomer, getOrder } from '../redux';
import { centsToDollars } from '../services';

function OrderCompleteScreen({
  style,
  navigation,
  route: {
    params: { orderId },
  },
}) {
  const customer = useSelector(getGingerCustomer);
  const order = useSelector(state => getOrder(state, orderId));

  const addressInfo = customer.addresses[customer.defaultAddress];
  const marker = {
    latitude: addressInfo.location.lat,
    longitude: addressInfo.location.lng,
  };

  useLayoutEffect(
    () =>
      navigation.setOptions({
        headerLeft: () => null,
      }),
    [navigation],
  );

  function handleOrderCancelPress() {
    navigateTo(ext('OrderCancellationScreen'), {
      orderId,
      nextScreen: ext('ProductListScreen'),
    });
  }

  function handleGoBack() {
    navigateTo(ext('ProductListScreen'));
  }

  return (
    <Screen styleName="paper">
      <ScrollView style={style.container}>
        <View style={style.titleContainer}>
          <Text style={style.title}>
            {I18n.t(ext('orderCompleteTitle'), { name: customer.firstName })}
          </Text>
        </View>
        <InlineMap
          initialRegion={{
            ...marker,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
          style={style.map}
          markers={[marker]}
          selectedMarker={marker}
        >
          <Overlay style={style.mapTextContainer}>
            <Text style={style.mapText}>{addressInfo.address}</Text>
          </Overlay>
        </InlineMap>
        <Text style={style.confirmationText}>
          {I18n.t(ext('orderCompleteConfirmationText'))}
        </Text>
        <View style={style.orderContainer}>
          <Text style={style.orderText}>
            {' '}
            {I18n.t(ext('orderCompleteOrderNumber'))}
          </Text>
          <Text style={style.orderText}>{orderId}</Text>
        </View>
        <Text style={style.infoText}>
          {I18n.t(ext('orderCompleteDeliveryAddress'))}
        </Text>
        <Text style={style.infoText}>
          {`${customer.firstName} ${customer.lastName}`}
        </Text>
        <Text style={style.infoText}>{order.address.googlePlaceName}</Text>
        <Text style={style.infoText}>{customer.phone}</Text>
        <Text style={style.infoText}>
          {I18n.t(ext('orderCompletePaymentMethod'))}
        </Text>
        <Text style={style.priceText}>
          {I18n.t(ext('orderCompleteTotalAmount'), {
            totalPrice: centsToDollars(order.subtotalPrice),
          })}
        </Text>
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
      </ScrollView>
      <View style={style.buttonContainer}>
        <Button style={style.button} onPress={handleGoBack}>
          <Text>{I18n.t(ext('orderCompleteConfirmButton'))}</Text>
        </Button>
      </View>
    </Screen>
  );
}

OrderCompleteScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      orderId: PropTypes.number.isRequired,
    }),
  }).isRequired,
  style: PropTypes.object,
};

OrderCompleteScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('OrderCompleteScreen'))(OrderCompleteScreen);
