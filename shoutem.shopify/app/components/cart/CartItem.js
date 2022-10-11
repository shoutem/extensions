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
    <Row style={style.mainContainer}>
      <Image
        style={style.image}
        source={productImage}
        defaultSource={imageAssets.fallback}
      />
      <View style={style.infoContainer}>
        <View style={style.nameContainer}>
          <Subtitle numberOfLines={2}>{itemTitle}</Subtitle>
          <CartCaption item={item} variantTitle={title} quantity={quantity} />
        </View>
        <View style={style.priceContainer}>
          <Subtitle style={style.price}>{priceString}</Subtitle>
          {showOldPrice && (
            <Caption style={style.oldPrice}>{oldPriceString}</Caption>
          )}
        </View>
      </View>
    </Row>
  );
}

CartItem.propTypes = {
  cartItem: cartItemShape.isRequired,
  shop: shopShape.isRequired,
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('CartItem'))(CartItem);
