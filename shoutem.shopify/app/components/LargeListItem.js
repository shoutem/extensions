import React, { useMemo } from 'react';
import { connectStyle } from '@shoutem/theme';
import { Image, TouchableOpacity, View } from '@shoutem/ui';
import { images as imageAssets } from '../assets';
import { ext } from '../const';
import { getProductImage } from '../services';
import ListItem from './ListItem';
import { AddToCartButton, ProductPrice, ProductTitle } from './product';

function LargeListItem({ item, onAddToCart, onPress, shop, style }) {
  const { currency = '', moneyFormat } = shop;
  const { images, title } = item;

  const productImage = useMemo(() => getProductImage(images), [images]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={style.container}
    >
      <Image
        style={style.image}
        source={productImage}
        defaultSource={imageAssets.fallback}
      />
      <View style={style.contentContainer}>
        <View style={style.priceContainer}>
          <ProductTitle title={title} />
          <ProductPrice
            product={item}
            currency={currency}
            moneyFormat={moneyFormat}
          />
        </View>
        <AddToCartButton onPress={onAddToCart} />
      </View>
    </TouchableOpacity>
  );
}

LargeListItem.propTypes = {
  ...ListItem.propTypes,
};

export default connectStyle(ext('LargeListItem'))(LargeListItem);
