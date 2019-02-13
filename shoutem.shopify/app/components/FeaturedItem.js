import React from 'react';

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

import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';

import { ext } from '../const';
import { shopItemHasDiscount } from '../services';

import ListItem from './ListItem';

const getDiscount = (price, originalPrice) =>
    Math.round((100 * (price - originalPrice)) / originalPrice);

const FeaturedItem = ({ item, onAddToCart, onPress, shop }) => {
  const { images, minimum_price, minimum_compare_at_price, title } = item;
  const { currency = '' } = shop;

  const shouldShowDiscount = shopItemHasDiscount(item);

  return (
    <TouchableOpacity onPress={onPress}>
      <View styleName="sm-gutter featured">
        <ImageBackground
          styleName="featured"
          source={{ uri: (images[0] || {}).src }}
          defaultSource={require('../assets/images/image-fallback.png')}
        >
          <Tile>
            { shouldShowDiscount ?
              <Overlay styleName="image-overlay">
                <Heading>
                  {`-${getDiscount(parseInt(minimum_price, 10),
                    parseInt(minimum_compare_at_price, 10))}%`}
                </Heading>
              </Overlay>
              :
              null
            }
            <Title styleName="md-gutter-top">{title}</Title>
            { shouldShowDiscount ?
              <Subtitle styleName="line-through sm-gutter-top">
                {`${minimum_compare_at_price} ${currency}`}
              </Subtitle>
              :
              null
            }
            <Heading styleName="md-gutter-top">{ `${minimum_price} ${currency}` }</Heading>
            <Button
              styleName="md-gutter-top"
              onPress={onAddToCart}
            >
              <Icon name="cart" />
              <Text>{I18n.t(ext('addToCartButton'))}</Text>
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
