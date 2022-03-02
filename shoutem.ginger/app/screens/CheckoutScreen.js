import React, { useEffect, useMemo, useState } from 'react';
import { TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Icon,
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
import {
  completeCheckout,
  getCart,
  getCustomerAddress,
  getDeliveryOptions,
  getGingerCustomer,
  loadDeliveryTimes,
  loadInventory,
  resetCart,
  updateCustomerInfo,
} from '../redux';

const DATE_MOMENT_FORMAT = 'ddd, MMM DD YYYY';
const TIME_INTERVAL_MOMENT_FORMAT = 'h a';

function CheckoutScreen({ style }) {
  const dispatch = useDispatch();
  const cart = useSelector(getCart);
  const { deliveryDates, deliveryTimeslots } = useSelector(getDeliveryOptions);
  const customer = useSelector(getGingerCustomer);
  const address = useSelector(getCustomerAddress);

  const [errorModalActive, setErrorModalActive] = useState(false);
  const [addressModalActive, setAddressModalActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deliveryDateOption, setDeliveryDateOption] = useState();
  const [deliveryTimeOption, setDeliveryTimeOption] = useState();
  const [additionalInformation, setAdditionalInformation] = useState();
  const [loading, setLoading] = useState();

  const deliveryDateOptions = useMemo(
    () =>
      _.map(deliveryDates, date => ({
        title: moment(date).format(DATE_MOMENT_FORMAT),
        key: date,
      })),
    [deliveryDates],
  );

  const deliveryTimeOptions = useMemo(() => {
    const timeslotsPerDate = deliveryDateOption
      ? deliveryTimeslots[deliveryDateOption.key]
      : _.head(deliveryTimeslots);

    return _.map(timeslotsPerDate, (interval, key) => {
      const startTime = new Date(
        `${moment().format('YYYY-MM-DD')}T${interval.start}`,
      );
      const endTime = new Date(
        `${moment().format('YYYY-MM-DD')}T${interval.end}`,
      );

      return {
        title: `${moment(startTime).format(
          TIME_INTERVAL_MOMENT_FORMAT,
        )} - ${moment(endTime).format(TIME_INTERVAL_MOMENT_FORMAT)}`,
        key,
      };
    });
  }, [deliveryTimeslots, deliveryDateOption]);

  useEffect(() => dispatch(loadDeliveryTimes()), [dispatch]);
  useEffect(() => setDeliveryDateOption(_.head(deliveryDateOptions)), [
    deliveryDateOptions,
  ]);
  useEffect(() => setDeliveryTimeOption(_.head(deliveryTimeOptions)), [
    deliveryTimeOptions,
  ]);

  function handleCompleteOrderPress() {
    setLoading(true);

    const matchingInterval =
      deliveryTimeslots[deliveryDateOption.key][deliveryTimeOption.key];
    const timeslotInfo = {
      date: deliveryDateOption.key,
      start: matchingInterval.start,
      end: matchingInterval.end,
    };

    dispatch(completeCheckout(timeslotInfo, additionalInformation))
      .then(() => {
        navigateTo(ext('OrderCompleteScreen'), {
          orderId: cart.id,
        });
        dispatch(resetCart());
      })
      // Redo with modal ( more extensive API response should be available )
      .catch(err => {
        setErrorModalActive(true);
        setErrorMessage(err.response.error.messages);
      })
      .finally(() => setLoading(false));
  }

  function handleAddressModalConfirm() {
    setAddressModalActive(false);
    navigateTo(ext('SelectLocationScreen'), {
      onLocationSelected: handleAddressChanged,
    });
  }

  function handleEditAddressPress() {
    setAddressModalActive(true);
  }

  function handleAddressChanged(data) {
    dispatch(updateCustomerInfo({ addresses: [{ ...data }] })).then(() => {
      dispatch(loadInventory());
      navigateTo(ext('ProductListScreen'));
      dispatch(resetCart());
    });
  }

  return (
    <Screen styleName="paper">
      <View style={style.infoSection}>
        <Icon name="ginger-warning" style={style.infoIcon} />
        <Text style={style.infoText}>
          {I18n.t(ext('ageAndPaymentRestrictions'))}
        </Text>
      </View>
      <ScrollView contentContainerStyle={style.scrollContainer}>
        <Text style={style.sectionTitle}>
          {I18n.t(ext('checkoutPhoneNumberTooltip'))}
        </Text>
        <Text style={style.sectionValue}>{customer.phone}</Text>
        <View style={style.addressSection}>
          <Text style={style.sectionTitle}>
            {I18n.t(ext('checkoutAddressTooltip'))}
          </Text>
          <Text style={style.sectionTitle} onPress={handleEditAddressPress}>
            {I18n.t(ext('checkoutAddressEditButton'))}
          </Text>
        </View>
        <Text style={style.sectionValue}>{address}</Text>
        <InlineDropDownMenu
          heading={I18n.t(ext('checkoutSelectDateTooltip'))}
          containerStyle={style.dropdownContainer}
          headingStyle={style.sectionTitle}
          selectedOptionContainerStyle={style.dropdownSelectedOptionContainer}
          selectedOptionTextStyle={style.dropdownSelectedOption}
          options={deliveryDateOptions}
          selectedOption={deliveryDateOption}
          selectedDescriptor="selected"
          onOptionSelected={setDeliveryDateOption}
        />
        <InlineDropDownMenu
          heading={I18n.t(ext('checkoutSelectTimeTooltip'))}
          options={deliveryTimeOptions}
          selectedOption={deliveryTimeOption}
          selectedDescriptor="selected"
          containerStyle={style.dropdownContainer}
          headingStyle={style.sectionTitle}
          selectedOptionContainerStyle={style.dropdownSelectedOptionContainer}
          selectedOptionTextStyle={style.dropdownSelectedOption}
          onOptionSelected={setDeliveryTimeOption}
        />
        <Text style={style.sectionTitle}>
          {I18n.t(ext('checkoutAdditionalInformationTooltip'))}
        </Text>
        <TextInput
          multiline
          maxLength={500}
          onChangeText={setAdditionalInformation}
          style={style.textInput}
          placeholder={I18n.t(ext('checkoutAdditionalInformationPlaceholder'))}
        />
      </ScrollView>
      <View style={style.buttonContainer}>
        <LoadingButton
          containerStyle={style.button}
          onPress={handleCompleteOrderPress}
          disabled={loading}
          label={I18n.t(ext('checkoutConfirmButton'))}
          loading={loading}
        />
      </View>
      <ConfirmationModal
        visible={errorModalActive}
        description={errorMessage}
        onCancel={() => setErrorModalActive(false)}
        cancelButtonText={I18n.t(ext('checkoutErrorModalButton'))}
      />
      <ConfirmationModal
        visible={addressModalActive}
        description={I18n.t(ext('checkoutAddressModalText'))}
        onCancel={() => setAddressModalActive(false)}
        onConfirm={handleAddressModalConfirm}
        cancelButtonText={I18n.t(ext('checkoutAddressModalCancelText'))}
        confirmButtonText={I18n.t(ext('checkoutAddressModalConfirmText'))}
      />
    </Screen>
  );
}

CheckoutScreen.propTypes = {
  style: PropTypes.object,
};

CheckoutScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('CheckoutScreen'))(CheckoutScreen);
