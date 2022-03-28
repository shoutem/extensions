import React from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  Image,
  Row,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { assets } from 'shoutem.layouts';

export default function SmallListMenuView({ item, onPress }) {
  const menuImage = item.image
    ? { uri: item.image.url }
    : assets.noImagePlaceholder;

  return (
    <TouchableOpacity onPress={() => onPress(item)} key={item.id}>
      <Row>
        <Image styleName="small placeholder" source={menuImage} />
        <View styleName="vertical stretch space-between">
          <Subtitle numberOfLines={2}>{item.name}</Subtitle>
          <Subtitle>{item.price}</Subtitle>
        </View>
      </Row>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
}

SmallListMenuView.propTypes = {
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};
