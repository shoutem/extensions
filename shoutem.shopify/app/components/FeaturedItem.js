import React, { useMemo } from 'react';
import { connectStyle } from '@shoutem/theme';
import { ImageBackground, TouchableOpacity, View } from '@shoutem/ui';
import { images as imageAssets } from '../assets';
import { ext } from '../const';
import { getProductImage } from '../services';
import ListItem from './ListItem';
import { AddToCartButton, ProductPrice, ProductTitle } from './product';

function FeaturedItem({ item, onAddToCart, onPress, shop, style }) {
  const { currency = '', moneyFormat } = shop;
  const { images, title } = item;

  const productImage = useMemo(() => getProductImage(images), [images]);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <ImageBackground
        style={style.container}
        source={productImage}
        defaultSource={imageAssets.fallback}
      >
        <View style={style.gradient} />
        <View style={style.contentContainer}>
          <View style={style.priceContainer}>
            <ProductTitle isFeatured title={title} />
            <ProductPrice
              isFeatured
              product={item}
              currency={currency}
              moneyFormat={moneyFormat}
            />
          </View>
          <AddToCartButton isFeatured onPress={() => onAddToCart(item)} />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

FeaturedItem.propTypes = {
  ...ListItem.propTypes,
};

export default connectStyle(ext('FeaturedItem'))(FeaturedItem);
