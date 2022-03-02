import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Screen, ScrollView, Text, TouchableOpacity } from '@shoutem/ui';
import { loginRequired } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { goBack, navigateTo } from 'shoutem.navigation';
import { images } from '../assets';
import {
  AdditionalInformation,
  CartFooterButtons,
  CartListItem,
  ConfirmationModal,
  OrderInformation,
  PlaceholderView,
  PromoCodeModal,
  RetailerListModal,
} from '../components';
import { ext } from '../const';
import {
  addToCart,
  applyPromoCode,
  getActiveDiscount,
  getCart,
  getCartListItems,
  getRetailersList,
  isCartLoading,
  removeFromCart,
} from '../redux';

function CartScreen({ style }) {
  const dispatch = useDispatch();
  const listItems = useSelector(getCartListItems);
  const cartLoading = useSelector(isCartLoading);
  const activePromoCode = useSelector(getActiveDiscount);
  const cart = useSelector(getCart);
  const retailers = useSelector(getRetailersList);

  const [removeItemModalVisible, setRemoveItemModalVisible] = useState(false);
  const [retailersModalVisible, setRetailersModalVisible] = useState(false);
  const [promoCodeModalVisible, setPromoCodeModalVisible] = useState(false);
  const [promoCodeError, setPromoCodeError] = useState();
  const [removedItemSkuId, setRemovedItemSkuId] = useState(null);

  const showRetailers = useMemo(() => retailers && !_.isEmpty(retailers), [
    retailers,
  ]);

  function handleQuantityChange(skuId, quantity) {
    dispatch(addToCart(skuId, quantity));
  }

  function handleProductRemovePress(skuId) {
    setRemoveItemModalVisible(true);
    setRemovedItemSkuId(skuId);
  }

  function handleProductRemoveCancel() {
    setRemoveItemModalVisible(false);
    setRemovedItemSkuId(null);
  }

  function handlePromoCodePress() {
    setPromoCodeModalVisible(true);
  }

  function handlePromoCodeClose() {
    setPromoCodeModalVisible(false);
    setPromoCodeError(undefined);
  }

  function handleApplyCode(code) {
    dispatch(applyPromoCode(code))
      .then(() => _.delay(() => handlePromoCodeClose(), 500))
      .catch(() => setPromoCodeError(I18n.t(ext('cartInvalidPromoCode'))));
  }

  function handleProductRemoveConfirm() {
    // Delaying modal close so that the LayoutAnimation can animate
    // order info change. Simultaneous modal close with the other animation
    // causes the crash ( RN Issue )
    dispatch(removeFromCart(removedItemSkuId)).then(() =>
      _.delay(handleProductRemoveCancel, 500),
    );
  }

  function handleCheckoutPress() {
    navigateTo(ext('CheckoutScreen'));
  }

  if (!cartLoading && _.isEmpty(listItems)) {
    return (
      <Screen styleName="paper">
        <PlaceholderView
          image={images.emptyCart}
          onButtonPress={goBack}
          buttonLabel={I18n.t(ext('cartEmptyStateButtonTitle'))}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={style.scrollContainer}>
        {_.map(listItems, item => (
          <CartListItem
            item={item}
            key={item.skuId}
            disabled={cartLoading}
            onQuantityChange={handleQuantityChange}
            onRemovePress={handleProductRemovePress}
          />
        ))}
        <TouchableOpacity
          onPress={handlePromoCodePress}
          style={style.promoCodeContainer}
        >
          <Text style={style.promoCodeText}>
            {I18n.t(ext('cartScreenPromoCodeButton'))}
          </Text>
          <Image source={images.arrowRight} style={style.promoCodeIcon} />
        </TouchableOpacity>
        <OrderInformation loading={cartLoading} cartData={cart} />
        <AdditionalInformation
          onRetailersPress={() => setRetailersModalVisible(true)}
          showRetailers={showRetailers}
        />
      </ScrollView>
      <CartFooterButtons
        onBack={goBack}
        onCheckoutPress={handleCheckoutPress}
        cartData={cart}
      />
      <ConfirmationModal
        visible={removeItemModalVisible}
        loading={cartLoading}
        onCancel={handleProductRemoveCancel}
        onConfirm={handleProductRemoveConfirm}
        cancelButtonText={I18n.t(ext('removeFromCartCancel'))}
        confirmButtonText={I18n.t(ext('removeFromCartConfirm'))}
        description={I18n.t(ext('removeFromCartMessage'))}
      />
      <RetailerListModal
        visible={retailersModalVisible}
        onClose={() => setRetailersModalVisible(false)}
        retailers={retailers}
      />
      <PromoCodeModal
        activeCode={activePromoCode}
        loading={cartLoading}
        visible={promoCodeModalVisible}
        onClose={handlePromoCodeClose}
        onClearCode={() => handleApplyCode('')}
        onApplyCode={handleApplyCode}
        error={promoCodeError}
      />
    </Screen>
  );
}

CartScreen.propTypes = {
  style: PropTypes.object,
};

CartScreen.defaultProps = {
  style: {},
};

export default loginRequired(connectStyle(ext('CartScreen'))(CartScreen));
