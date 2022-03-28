import React from 'react';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Divider,
  Heading,
  Icon,
  ImageBackground,
  Overlay,
  Subtitle,
  Text,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { images as localImages } from '../assets';
import { ext } from '../const';
import { getDiscount } from '../services/getDiscount';
import ListItem from './ListItem';

const FeaturedItem = ({ item, onAddToCart, onPress, shop }) => {
  const { images, title } = item;

  const variant = item.variants[0];
  const newPrice = parseFloat(variant.price);
  const oldPrice = parseFloat(variant.compareAtPrice);
  const { currency = '' } = shop;
  const newPriceString = `${currency}${newPrice}`;
  const oldPriceString = oldPrice ? `${currency}${oldPrice}` : null;

  const productImage = images[0]
    ? { uri: images[0].src }
    : localImages.fallback;

  return (
    <TouchableOpacity onPress={onPress}>
      <View styleName="sm-gutter featured">
        <ImageBackground
          styleName="featured"
          source={productImage}
          defaultSource={images.fallback}
        >
          <Tile>
            {!!oldPrice && newPrice < oldPrice && (
              <Overlay styleName="image-overlay">
                {/* eslint-disable-next-line react-native/no-raw-text */}
                <Heading>{`${getDiscount(newPrice, oldPrice)}%`}</Heading>
              </Overlay>
            )}
            <Title styleName="md-gutter-top">{title}</Title>
            {!!oldPrice && newPrice < oldPrice && (
              <Subtitle styleName="line-through sm-gutter-top">
                {oldPriceString}
              </Subtitle>
            )}
            <Heading styleName="md-gutter-top">{newPriceString}</Heading>
            <Button styleName="md-gutter-top" onPress={onAddToCart}>
              <Icon name="cart" />
              <Text>{I18n.t(ext('addToCartNavBarTitle'))}</Text>
            </Button>
          </Tile>
        </ImageBackground>
      </View>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
};

FeaturedItem.propTypes = {
  ...ListItem.propTypes,
};

export default connectStyle(ext('FeaturedItem'))(FeaturedItem);
