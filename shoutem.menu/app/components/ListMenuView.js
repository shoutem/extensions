import React from 'react';
import PropTypes from 'prop-types';
import {
  ImageBackground,
  Title,
  Divider,
  TouchableOpacity,
  Tile,
} from '@shoutem/ui';
import { PriceOverlay } from './PriceOverlay';

const ListMenuView = props => {
  const { onPress, item } = props;

  return (
    <TouchableOpacity key={item.id} onPress={() => onPress(item)}>
      <ImageBackground
        styleName="large-banner placeholder"
        source={{ uri: item.image ? item.image.url : undefined }}
      >
        <Tile>
          <Title styleName="md-gutter-bottom">{item.name.toUpperCase()}</Title>
          <PriceOverlay price={item.price} />
        </Tile>
      </ImageBackground>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
};

ListMenuView.propTypes = {
  onPress: PropTypes.func,
  item: PropTypes.object.isRequired,
};

export default ListMenuView;
