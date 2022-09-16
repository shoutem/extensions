import React, { useMemo } from 'react';
import { connectStyle } from '@shoutem/theme';
import { Image, TouchableOpacity, View } from '@shoutem/ui';
import { images as imageAssets } from '../assets';
import { ext } from '../const';
import { getProductImage } from '../services';
import ListItem from './ListItem';
import { AddToCartButton, ProductPrice, ProductTitle } from './product';

function GridItem({
  item,
  isTall,
  isFixed,
  onAddToCart,
  onPress,
  shop,
  style,
}) {
  const { currency = '', moneyFormat } = shop;
  const { images, title } = item;

  const productImage = useMemo(() => getProductImage(images), [images]);
  const imageStyle = useMemo(() => {
    if (isTall) {
      return style.tallImage;
    }

    if (isFixed) {
      return style.fixedImage;
    }

    return style.image;
  }, [isTall, isFixed, style]);

  const resolvedTextContainerStyle = useMemo(
    () => [style.textContainer, isFixed && style.fixedContainer],
    [style, isFixed],
  );

  return (
    <TouchableOpacity onPress={onPress} style={style.container}>
      <View style={style.imageContainer}>
        <Image
          style={imageStyle}
          source={productImage}
          defaultSource={imageAssets.fallback}
        />
      </View>
      <View style={resolvedTextContainerStyle}>
        <ProductTitle title={title} />
        <View style={style.priceContainer}>
          <ProductPrice
            product={item}
            currency={currency}
            moneyFormat={moneyFormat}
            wide
          />
          <AddToCartButton onPress={onAddToCart} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

GridItem.propTypes = {
  ...ListItem.propTypes,
};

export default connectStyle(ext('GridItem'))(GridItem);
