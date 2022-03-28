import React from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  ImageBackground,
  Tile,
  Title,
  TouchableOpacity,
} from '@shoutem/ui';
import { assets } from 'shoutem.layouts';
import { PriceOverlay } from './PriceOverlay';

export default function ListMenuView({ item, onPress }) {
  const menuImage = item.image
    ? { uri: item.image.url }
    : assets.noImagePlaceholder;

  return (
    <TouchableOpacity key={item.id} onPress={() => onPress(item)}>
      <ImageBackground styleName="large-banner placeholder" source={menuImage}>
        <Tile>
          <Title styleName="md-gutter-bottom">{item.name.toUpperCase()}</Title>
          <PriceOverlay price={item.price} />
        </Tile>
      </ImageBackground>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
}

ListMenuView.propTypes = {
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};
