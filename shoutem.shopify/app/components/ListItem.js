import React from 'react';
import PropTypes from 'prop-types';

import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Divider,
  Icon,
  Image,
  Subtitle,
  Row,
  TouchableOpacity,
  View,
} from '@shoutem/ui';

import images from '../assets/images'
import { ext } from '../const';
import {
  product as productShape,
  shop as shopShape,
} from './shapes';

const ListItem = ({ item, onAddToCart, onPress, shop }) => {
  const { images, title } = item;
  const { currency = '' } = shop;

  const variant = item.variants[0];
  const newPrice = parseFloat(variant.price);
  const oldPrice = parseFloat(variant.compareAtPrice);

  const newPriceString = `${currency}${newPrice}`;
  const oldPriceString = oldPrice ? `${currency}${oldPrice}` : null;

  // TODO: Format currency in locale
  return (
    <TouchableOpacity onPress={onPress}>
      <Row>
        <Image
          styleName="small"
          source={{ uri: (images[0] || {}).src }}
          defaultSource={images.fallback}
        />
        <View styleName="vertical stretch space-between">
          <Subtitle>{title}</Subtitle>
          <View styleName="horizontal">
            <Subtitle styleName="md-gutter-right">
              {newPriceString}
            </Subtitle>
            {oldPriceString &&
              <Caption styleName="line-through">
                {oldPriceString}
              </Caption>
            }
          </View>
        </View>
        <Button onPress={onAddToCart} styleName="right-icon">
          <Icon name="add-to-cart" />
        </Button>
      </Row>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
};

const { func } = PropTypes;

ListItem.propTypes = {
  // Product
  item: productShape.isRequired,
  // Called when item is added to cart
  onAddToCart: func,
  // Called when item is pressed
  onPress: func,
  // Shop, used to display currency
  shop: shopShape.isRequired,
};

export default connectStyle(ext('ListItem'))(ListItem);
