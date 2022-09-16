import React, { useMemo } from 'react';
import { connectStyle } from '@shoutem/theme';
import { ImageBackground, TouchableOpacity, View } from '@shoutem/ui';
import { images as imageAssets } from '../assets';
import { ext } from '../const';
import { getProductImage } from '../services';
import ListItem from './ListItem';
import { AddToCartButton, ProductPrice, ProductTitle } from './product';

function TileItem({ item, onAddToCart, onPress, shop, style }) {
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
        <View style={style.overlay} />
        <View style={style.contentContainer}>
          <ProductTitle isFeatured title={title} style={style.title} />
          <ProductPrice
            isFeatured
            secondary
            product={item}
            currency={currency}
            moneyFormat={moneyFormat}
            style={style.priceContainer}
          />
          <AddToCartButton
            onPress={onAddToCart}
            showTitle
            style={style.buyButton}
          />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

TileItem.propTypes = {
  ...ListItem.propTypes,
};

export default connectStyle(ext('TileItem'))(TileItem);
