import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Text, TouchableOpacity, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { images } from '../../assets';
import { ext, LOW_QUANTITY_MAX_SIZE } from '../../const';
import { getCartItemQuantity } from '../../redux';
import {
  getCartProductOriginPrice,
  getCartProductPrice,
  getProductTotalUnits,
  isBonusCartItem,
} from '../../services';
import QuantitySelector from '../QuantitySelector';

export function CartListItem({
  item,
  onQuantityChange,
  onRemovePress,
  disabled,
  presentational,
  style,
}) {
  const { sku } = item;
  const { product } = sku;

  const quantityOnStock = useSelector(state =>
    getCartItemQuantity(state, item.skuId),
  );

  const isBonus = isBonusCartItem(item);
  const subtitle = useMemo(() => getProductTotalUnits(sku, item.quantity), [
    item,
    sku,
  ]);
  const totalPrice = useMemo(() => getCartProductPrice(item), [item]);
  const discountedPrice = useMemo(() => getCartProductOriginPrice(item), [
    item,
  ]);

  const showDiscountedPrice = !isBonus && discountedPrice !== totalPrice;
  const hasLowQuantity = quantityOnStock <= LOW_QUANTITY_MAX_SIZE;

  function handleQuantityChange(quantity) {
    onQuantityChange(item.skuId, quantity);
  }

  function handleRemovePress() {
    onRemovePress(item.skuId);
  }

  return (
    <View style={style.mainContainer}>
      <View style={style.container}>
        <Image source={{ uri: _.head(product.images) }} style={style.image} />
        <View style={style.contentContainer}>
          <View style={style.infoContainer}>
            <Text style={style.title}>{product.name || 'Product name'}</Text>
            <Text style={style.units}>{subtitle}</Text>
            {!isBonus && !presentational && (
              <QuantitySelector
                count={item.quantity}
                compact
                unaryCountChange
                disabled={disabled}
                maxCount={product.quantity}
                onCountChange={handleQuantityChange}
              />
            )}
            {presentational && !isBonus && (
              <Text style={style.title}>{item.quantity}</Text>
            )}
            {isBonus && (
              <View styleName="horizontal v-center">
                <Text style={style.title}>{item.quantity}</Text>
                <Image source={images.present} style={style.bonusImage} />
              </View>
            )}
          </View>
          <View style={style.priceContainer}>
            <Text stlye={style.price}>{totalPrice}</Text>
            {showDiscountedPrice && (
              <Text style={style.discountPrice}>{discountedPrice}</Text>
            )}
            {!isBonus && !presentational && (
              <TouchableOpacity disabled={disabled} onPress={handleRemovePress}>
                <Text style={style.removeButton}>
                  {I18n.t(ext('removeFromCart'))}
                </Text>
              </TouchableOpacity>
            )}
            {isBonus && (
              <Text style={style.discountPrice}>{discountedPrice}</Text>
            )}
          </View>
        </View>
      </View>
      {hasLowQuantity && !isBonus && !presentational && (
        <Text style={style.lowQuantityText}>
          {I18n.t(ext('cartItemLowQuantity'), {
            quantity: quantityOnStock,
          })}
        </Text>
      )}
    </View>
  );
}

CartListItem.propTypes = {
  item: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  presentational: PropTypes.bool,
  style: PropTypes.object,
  onQuantityChange: PropTypes.func,
  onRemovePress: PropTypes.func,
};

CartListItem.defaultProps = {
  disabled: false,
  onQuantityChange: undefined,
  onRemovePress: undefined,
  presentational: false,
  style: {},
};

export default React.memo(connectStyle(ext('CartListItem'))(CartListItem));
