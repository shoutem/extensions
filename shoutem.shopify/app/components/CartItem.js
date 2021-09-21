import React from 'react';

import { I18n } from 'shoutem.i18n';

import { connectStyle } from '@shoutem/theme';
import { Caption, Image, Row, Subtitle, View } from '@shoutem/ui';

import { ext } from '../const';
import { cartItem as cartItemShape, shop as shopShape } from './shapes';

/**
 * Renders caption with variant title and quantity or only quantity if product
 * does not have any variants
 */
const VariantCaption = ({ item, variantTitle, quantity }) => {
  let resolvedVariantTitle = variantTitle;
  if (variantTitle === item.title || variantTitle === 'Default Title') {
    resolvedVariantTitle = '';
  }

  const resolvedVariantText =
    resolvedVariantTitle === '' ? '' : `${resolvedVariantTitle}  ·  `;

  return (
    <Caption ellipsizeMode="middle" numberOfLines={1}>
      {resolvedVariantText}
      {I18n.t(ext('itemQuantity'))}
      {quantity}
    </Caption>
  );
};

/**
 * Renders a single cart item, with selected variant and quantity for a product
 */
const CartItem = ({ cartItem, shop }) => {
  const { item, variant, quantity } = cartItem;
  const { currency } = shop;

  const { price, compare_at_price: oldPrice, title } = variant;
  const { images, title: itemTitle } = item;
  const resolvedVariantTitle = title === item.title ? '' : `${title}  ·  `;

  return (
    <Row>
      <Image styleName="small" source={{ uri: (images[0] || {}).src }} />
      <View styleName="horizontal">
        <View styleName="space-between" style={{ flex: 7 }}>
          <Subtitle>{itemTitle}</Subtitle>
          <VariantCaption
            item={item}
            variantTitle={title}
            quantity={quantity}
          />
        </View>
        <View
          styleName="space-between vertical h-end sm-gutter-left"
          style={{ flex: 3 }}
        >
          {oldPrice && price < oldPrice && (
            <Caption styleName="line-through">
              {`${currency}${oldPrice}`}
            </Caption>
          )}
          <Subtitle>{`${currency}${price}`}</Subtitle>
        </View>
      </View>
    </Row>
  );
};

CartItem.propTypes = {
  // Cart item, consisting of product, selected variant and quantity
  cartItem: cartItemShape.isRequired,
  // Shop, used to display currency
  shop: shopShape.isRequired,
};

export default connectStyle(ext('CartItem'))(CartItem);
