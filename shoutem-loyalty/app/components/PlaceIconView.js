import React from 'react';
import {
  TouchableOpacity,
  Caption,
  Icon,
  Image,
  Divider,
  Row,
  Subtitle,
  View,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';
import withOpenPlaceDetails from '../shared/withOpenPlaceDetails';
import { placeShape } from './shapes';

const DEFAULT_IMAGE = require('../assets/data/no_image.png');

const { func } = React.PropTypes;

/**
 * Renders a single place in a list.
 */
const PlaceIconView = (props) => {
  const { place, onPress } = props;
  const { points } = place;
  const imageSource = place.image ? { uri: place.image.url } : DEFAULT_IMAGE;

  return (
    <TouchableOpacity onPress={onPress}>
      <Row>
        <Image
          styleName="small rounded-corners"
          source={imageSource}
        />
        <View styleName="vertical stretch space-between">
          <Subtitle numberOfLines={2}>{place.name}</Subtitle>
          <View styleName="horizontal">
            <Caption>{`${points || 'No'} points collected` }</Caption>
          </View>
        </View>
        <Icon styleName="disclosure" name="right-arrow" />
      </Row>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
};

PlaceIconView.propTypes = {
  // The place
  place: placeShape.isRequired,
  // Called when place is pressed
  onPress: func,
};

const styledComponent = connectStyle(ext('PlaceIconView'))(PlaceIconView);

export default withOpenPlaceDetails(styledComponent);
