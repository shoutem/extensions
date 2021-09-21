import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Image,
  Subtitle,
  Row,
  View,
  Divider,
  TouchableOpacity,
} from '@shoutem/ui';

const SmallListMenuView = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)} key={item.id}>
      <Row>
        <Image
          styleName="small placeholder"
          source={{ uri: _.get(item, 'image.url') }}
        />
        <View styleName="vertical stretch space-between">
          <Subtitle numberOfLines={2}>{item.name}</Subtitle>
          <Subtitle>{item.price}</Subtitle>
        </View>
      </Row>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
};

SmallListMenuView.propTypes = {
  onPress: PropTypes.func,
  item: PropTypes.object.isRequired,
};

export default SmallListMenuView;
