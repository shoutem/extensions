import React, { PureComponent } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Favorite } from 'shoutem.favorites';
import { connectStyle } from '@shoutem/theme';
import {
  TouchableOpacity,
  Caption,
  ImageBackground,
  Divider,
  Tile,
  Title,
  View,
} from '@shoutem/ui';
import { getFirstImage } from '../services/places';
import withOpenPlaceDetails from '../shared/withOpenPlaceDetails';
import { ext } from '../const';

export class PlacePhotoView extends PureComponent {
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
    const imageSource = leadImage ? { uri: leadImage.url } : undefined;
    const placeName = place?.name?.toUpperCase() || '';

    return (
      <TouchableOpacity onPress={onPress}>
        <Divider styleName="line" />
        <ImageBackground
          source={imageSource}
          styleName="large-banner placeholder"
        >
          <Tile>
            <View styleName="actions" virtual>
              <Favorite item={place} schema={schema} />
            </View>
            <Title numberOfLines={2} styleName="vertical">
              {placeName}
            </Title>
            <Caption styleName="vertical">{formattedAddress}</Caption>
          </Tile>
        </ImageBackground>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

const styledComponent = connectStyle(ext('PlacePhotoView'))(PlacePhotoView);

export default withOpenPlaceDetails(styledComponent);
