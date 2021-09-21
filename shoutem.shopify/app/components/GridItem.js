import React from 'react';

import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Card,
  Icon,
  Image,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';

import images from '../assets/images';
import { ext } from '../const';
import ListItem from './ListItem';

const GridItem = ({ item, isTall, onAddToCart, onPress, shop }) => {
  const { images, title } = item;

  const variant = item.variants[0];
  const newPrice = parseFloat(variant.price);
  const oldPrice = parseFloat(variant.compareAtPrice);
  const { currency = '' } = shop;

  const newPriceString = `${currency}${newPrice}`;
  const oldPriceString = oldPrice ? `${currency}${oldPrice}` : null;

  return (
    <TouchableOpacity onPress={onPress}>
      <Card styleName="flexible">
        <View styleName="horizontal h-center v-start">
          <Image
            styleName={isTall ? 'medium-square' : 'medium-wide'}
            source={{ uri: (images[0] || {}).src }}
            defaultSource={images.fallback}
          />
        </View>
        <View styleName="content">
          <Subtitle numberOfLines={2}>{title}</Subtitle>
          <View styleName="horizontal v-center space-between">
            <Subtitle styleName="md-gutter-right bold">
              {newPriceString}
            </Subtitle>
            {oldPriceString && (
              <Caption styleName="line-through">{oldPriceString}</Caption>
            )}
            <Button onPress={onAddToCart} styleName="tight clear">
              <Icon name="add-to-cart" />
            </Button>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

GridItem.propTypes = {
  ...ListItem.propTypes,
};

export default connectStyle(ext('GridItem'))(GridItem);
