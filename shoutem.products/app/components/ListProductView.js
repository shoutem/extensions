import React from 'react';
import PropTypes from 'prop-types';
import {
  Caption,
  Divider,
  Image,
  Row,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { assets } from 'shoutem.layouts';

export default function ListProductView({ product, onPress }) {
  function handleItemPress() {
    onPress(product);
  }

  const productImage = product?.image
    ? { uri: product.image.url }
    : assets.noImagePlaceholder;

  return (
    <TouchableOpacity onPress={handleItemPress}>
      <Row>
        <Image styleName="small placeholder" source={productImage} />
        <View styleName="vertical stretch space-between">
          <Subtitle numberOfLines={2}>{product.name}</Subtitle>
          <View styleName="horizontal">
            <Subtitle>{product.currentPrice}</Subtitle>
            <Caption styleName="line-through sm-gutter-left">
              {product.oldPrice}
            </Caption>
          </View>
        </View>
      </Row>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
}

ListProductView.propTypes = {
  product: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};
