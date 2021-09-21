import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  Image,
  View,
  Subtitle,
  Caption,
  Row,
  Divider,
} from '@shoutem/ui';

export default function ListProductView({ product, onPress }) {
  const handleItemPress = () => {
    onPress(product);
  };

  return (
    <TouchableOpacity onPress={handleItemPress}>
      <Row>
        <Image
          styleName="small placeholder"
          source={{ uri: _.get(product, 'image.url') }}
        />
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
