import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Caption, Image, Row, Subtitle, View } from '@shoutem/ui';
import { images as imageAssets } from '../../assets';
import { ext } from '../../const';
import { formatPrice, getProductImage } from '../../services';
import { cartItem as cartItemShape, shop as shopShape } from '../shapes';
import CartCaption from './CartCaption';

function CartItem({ cartItem, shop, style }) {
  const { item, variant, quantity } = cartItem;
  const { currency, moneyFormat } = shop;
  const { images, title: itemTitle } = item;
  const { price, compareAtPrice: oldPrice, title } = variant;

  const priceString = useMemo(() => formatPrice(price, currency, moneyFormat), [
    price,
    currency,
    moneyFormat,
  ]);

  const showOldPrice = useMemo(() => !!oldPrice && price < oldPrice, [
    oldPrice,
    price,
  ]);

  const oldPriceString = useMemo(
    () => formatPrice(oldPrice, currency, moneyFormat),
    [oldPrice, currency, moneyFormat],
  );

  const productImage = useMemo(() => getProductImage(images), [images]);

  return (
    <Row>
      <Image
        styleName="small"
        source={productImage}
        defaultSource={imageAssets.fallback}
      />
      <View styleName="horizontal">
        <View style={style.titleContainer}>
          <Subtitle>{itemTitle}</Subtitle>
          <CartCaption item={item} variantTitle={title} quantity={quantity} />
        </View>
        <View style={style.priceContainer}>
          {showOldPrice && (
            <Caption styleName="line-through">{oldPriceString}</Caption>
          )}
          <Subtitle>{priceString}</Subtitle>
        </View>
      </View>
    </Row>
  );
}

CartItem.propTypes = {
  cartItem: cartItemShape.isRequired,
  shop: shopShape.isRequired,
  style: PropTypes.object,
};

CartItem.defaultProps = {
  style: {},
};

export default connectStyle(ext('CartItem'))(CartItem);
