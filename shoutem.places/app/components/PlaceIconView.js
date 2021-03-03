import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Favorite } from 'shoutem.favorites';
import { connectStyle } from '@shoutem/theme';
import {
  TouchableOpacity,
  Caption,
  Image,
  Divider,
  Row,
  Subtitle,
  View,
} from '@shoutem/ui';
import withOpenPlaceDetails from '../shared/withOpenPlaceDetails';
import { getFirstImage } from '../services/places';
import { ext } from '../const';

const DEFAULT_IMAGE = require('../assets/data/no_image.png');

export class PlaceIconView extends PureComponent {
  static propTypes = {
    place: PropTypes.object.isRequired,
    onPress: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      schema: ext('places'),
    };
  }

  render() {
    const { place, onPress } = this.props;
    const { schema } = this.state;
    const { location = {} } = place;
    const { formattedAddress = '' } = location;
    const leadImage = getFirstImage(place);
    const imageSource = leadImage ? { uri: leadImage.url } : DEFAULT_IMAGE;

    return (
      <TouchableOpacity onPress={onPress}>
        <Row>
          <Image source={imageSource} styleName="small rounded-corners" />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={2}>{place.name}</Subtitle>
            <View styleName="horizontal">
              <Caption>{formattedAddress}</Caption>
            </View>
          </View>
          <Favorite item={place} schema={schema} />
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

const styledComponent = connectStyle(ext('PlaceIconView'))(PlaceIconView);

export default withOpenPlaceDetails(styledComponent);
