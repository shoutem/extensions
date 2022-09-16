import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Row, TouchableOpacity, View } from '@shoutem/ui';
import { images as imageAssets } from '../assets';
import { ext } from '../const';
import { getProductImage } from '../services';
import { AddToCartButton, ProductPrice, ProductTitle } from './product';
import { product as productShape, shop as shopShape } from './shapes';

function MediumListItem({ item, onAddToCart, onPress, shop, style }) {
  const { images, title } = item;
  const { currency = '', moneyFormat } = shop;

  const productImage = useMemo(() => getProductImage(images), [images]);

  return (
    <TouchableOpacity onPress={onPress}>
      <Row style={style.container}>
        <Image
          style={style.image}
          source={productImage}
          defaultSource={imageAssets.fallback}
        />
        <View style={style.contentContainer}>
          <View style={style.productContainer}>
            <ProductTitle title={title} />
            <ProductPrice
              product={item}
              currency={currency}
              moneyFormat={moneyFormat}
            />
          </View>
          <View style={style.cartIcon}>
            <AddToCartButton onPress={onAddToCart} />
          </View>
        </View>
      </Row>
    </TouchableOpacity>
  );
}

MediumListItem.propTypes = {
  item: productShape.isRequired,
  shop: shopShape.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

MediumListItem.defaultProps = {
  style: {},
};

export default connectStyle(ext('MediumListItem'))(MediumListItem);
