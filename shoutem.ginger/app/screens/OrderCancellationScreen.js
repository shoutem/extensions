import React, { useMemo, useState } from 'react';
import { TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Image,
  InlineDropDownMenu,
  Screen,
  ScrollView,
  Text,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { navigateTo } from 'shoutem.navigation';
import { ConfirmationModal, LoadingButton } from '../components';
import { ext } from '../const';
import { cancelOrder, getOrder, getOrderImages } from '../redux';
import { centsToDollars } from '../services';

const CANCEL_REASON_KEYS = [
  'cancelReasonMistake',
  'cancelReasonChangedMyMind',
  'cancelReasonDeliveryTime',
  'cancelReasonWrongAddress',
];

function OrderCancellationScreen({
  style,
  route: {
    params: { orderId, nextScreen },
  },
}) {
  const cancelReasonOptions = useMemo(
    () => _.map(CANCEL_REASON_KEYS, key => ({ key, title: I18n.t(ext(key)) })),
    [],
  );

  const dispatch = useDispatch();
  const order = useSelector(state => getOrder(state, orderId));
  const orderImages = useSelector(state => getOrderImages(state, orderId));

  const [loading, setLoading] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState();
  const [cancelReason, setCancelReason] = useState(_.head(cancelReasonOptions));
  const [confirmationModalActive, setConfirmationModalActive] = useState(false);

  function handleCancelOrderPress() {
    const additionalInfoLabel = additionalInfo ? ` - ${additionalInfo}` : '';
    const reason = `${cancelReason.title}${additionalInfoLabel}`;

    setLoading(true);
    dispatch(cancelOrder(orderId, reason)).then(() => {
      setLoading(false);
      setConfirmationModalActive(true);
    });
  }

  function handleConfirmationMessageTap() {
    setConfirmationModalActive(false);
    navigateTo(nextScreen);
  }

  return (
    <Screen styleName="paper">
      <ScrollView contentContainerStyle={style.container}>
        <View style={style.infoContainer}>
          <View style={style.sectionContainer}>
            <Text style={style.sectionTitle}>
              {I18n.t(ext('cancelOrderTotal'))}
            </Text>
            <Text style={style.sectionTitle}>
              {`$${centsToDollars(order.subtotalPrice)}`}
            </Text>
          </View>
          <View style={style.sectionContainer}>
            <Text style={style.sectionTitle}>
              {I18n.t(ext('cancelOrderNumber'))}
            </Text>
            <Text style={style.sectionTitle}>{order.id}</Text>
          </View>
          <View style={style.sectionContainer}>
            <Text style={style.sectionTitle}>
              {I18n.t(ext('cancelOrderItems'))}
            </Text>
          </View>
          <ScrollView horizontal contentContainerStyle={style.imageContainer}>
            {_.map(orderImages, image => (
              <Image style={style.image} source={{ uri: image }} />
            ))}
          </ScrollView>
        </View>
        <InlineDropDownMenu
          heading={I18n.t(ext('cancelOrderReasonTooltip'))}
          options={cancelReasonOptions}
          selectedOption={cancelReason}
          selectedDescriptor="selected"
          containerStyle={style.dropdownContainer}
          headingStyle={style.dropdownSectionTitle}
          selectedOptionContainerStyle={style.dropdownSelectedOptionContainer}
          selectedOptionTextStyle={style.dropdownSelectedOption}
          onOptionSelected={setCancelReason}
        />
        <Text style={style.dropdownSectionTitle}>
          {I18n.t(ext('cancelOrderAdditionalInfoTooltip'))}
        </Text>
        <TextInput
          multiline
          maxLength={500}
          onChangeText={setAdditionalInfo}
          style={style.textInput}
          placeholder={I18n.t(ext('cancelOrderAdditionalInfoPlaceholder'))}
        />
      </ScrollView>
      <View style={style.buttonContainer}>
        <LoadingButton
          containerStyle={style.button}
          label={I18n.t(ext('cancelOrderButton'))}
          onPress={handleCancelOrderPress}
          disabled={loading}
          loading={loading}
        />
      </View>
      <ConfirmationModal
        onCancel={handleConfirmationMessageTap}
        cancelButtonText={I18n.t(ext('cancelOrderConfirmationButton'))}
        visible={confirmationModalActive}
        description={I18n.t(ext('cancelOrderConfirmationText'))}
      />
    </Screen>
  );
}

OrderCancellationScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      nextScreen: PropTypes.string.isRequired,
      orderId: PropTypes.number.isRequired,
    }),
  }).isRequired,
  style: PropTypes.object,
};

OrderCancellationScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('OrderCancellationScreen'))(
  OrderCancellationScreen,
);
