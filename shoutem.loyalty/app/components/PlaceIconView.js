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
import { I18n } from 'shoutem.i18n';
import { ext, PLACES_SCHEMA } from '../const';
import { withOpenPlaceDetails } from '../shared';
import { placeShape } from './shapes';

const DEFAULT_IMAGE = require('../assets/data/no_image.png');

const { func, number } = PropTypes;

/**
 * Renders a single place in a list.
 */
class PlaceIconView extends PureComponent {
  static propTypes = {
    // The place
    place: placeShape.isRequired,
    // Points for this place
    points: number,
    // Called when place is pressed
    onPress: func,
  };

  render() {
    const { place, points, onPress } = this.props;
    const imageSource = place.image ? { uri: place.image.url } : DEFAULT_IMAGE;

    return (
      <TouchableOpacity onPress={onPress}>
        <Row>
          <Image styleName="small rounded-corners" source={imageSource} />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={2}>{place.name}</Subtitle>
            <View styleName="horizontal">
              <Caption>
                {I18n.t(ext('pointsInStore'), { count: points || 0 })}
              </Caption>
            </View>
          </View>
          <Favorite item={place} schema={PLACES_SCHEMA} />
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

const styledComponent = connectStyle(ext('PlaceIconView'))(PlaceIconView);

export default withOpenPlaceDetails(styledComponent);
