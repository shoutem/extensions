import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Divider,
  ImageBackground,
  Text,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { Favorite } from 'shoutem.favorites';
import { assets } from 'shoutem.layouts';
import { ext } from '../const';
import { getFirstImage } from '../services/places';
import withOpenPlaceDetails from '../shared/withOpenPlaceDetails';

export function PlaceFullGridRowView({ place, onPress, style, numberOfLines }) {
  const address = _.get(place, 'location.formattedAddress', '');
  const leadImage = getFirstImage(place);
  const placeImage = leadImage
    ? { uri: leadImage.url }
    : assets.noImagePlaceholder;

  return (
    <TouchableOpacity
      onPress={onPress}
      styleName="flexible"
      style={style.container}
    >
      <ImageBackground style={style.imageContainer} source={placeImage}>
        <Tile>
          <View styleName="actions" virtual>
            <Favorite item={place} schema={ext('places')} />
          </View>
        </Tile>
      </ImageBackground>
      <View style={style.textContainer}>
        <Title numberOfLines={1} style={style.title}>
          {place.name}
        </Title>
        <Text numberOfLines={numberOfLines} style={style.description}>
          {address}
        </Text>
      </View>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
}

PlaceFullGridRowView.propTypes = {
  place: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  numberOfLines: PropTypes.number,
};

PlaceFullGridRowView.defaultProps = {
  numberOfLines: 2,
};

export default withOpenPlaceDetails(
  connectStyle(ext('PlaceFullGridRowView'))(PlaceFullGridRowView),
);
