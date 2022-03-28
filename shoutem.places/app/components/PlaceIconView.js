import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  Image,
  Row,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { Favorite } from 'shoutem.favorites';
import { assets } from 'shoutem.layouts';
import { ext } from '../const';
import { getFirstImage } from '../services/places';
import withOpenPlaceDetails from '../shared/withOpenPlaceDetails';

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
    const placeImage = leadImage
      ? { uri: leadImage.url }
      : assets.noImagePlaceholder;

    return (
      <TouchableOpacity onPress={onPress}>
        <Row>
          <Image source={placeImage} styleName="small rounded-corners" />
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
