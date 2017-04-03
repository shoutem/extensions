import React from 'react';
import { connect } from 'react-redux';

import {
  TouchableOpacity,
  Image,
  View,
  Row,
  Divider,
  Subtitle,
  Caption,
} from '@shoutem/ui';
import {
  find,
} from '@shoutem/redux-io';
import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';
import { updateLocationPermission } from '../reducers';
import { PlacesList } from '../screens/PlacesList';

class IconPlacesList extends PlacesList {
  static propTypes = {
    ...PlacesList.propTypes,
  }

  renderRow(place) {
    const { navigateTo } = this.props;
    const { formattedAddress } = place.location;

    return (
      <TouchableOpacity
        onPress={() => navigateTo({
          screen: ext('PlaceDetails'),
          props: { place },
        })}
      >
        <Divider styleName="line" />
        <Row>
          <Image
            styleName="small rounded-corners"
            source={place.image ? { uri: place.image.url } : undefined}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={2}>{place.name}</Subtitle>
            <View styleName="horizontal">
              <Caption>{formattedAddress}</Caption>
            </View>
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export const mapStateToProps = (state, ownProps) => ({
  ...PlacesList.createMapStateToProps(state => state[ext()].allPlaces)(state, ownProps),
  permissionStatus: state[ext()].permissionStatus,
});

export const mapDispatchToProps = PlacesList.createMapDispatchToProps({
  navigateTo,
  find,
  updateLocationPermission,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('IconPlacesList'))(IconPlacesList),
);
