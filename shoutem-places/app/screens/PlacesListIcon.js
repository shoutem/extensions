import React, {
  Component
} from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  Row,
  Divider,
  Subtitle,
  Caption,
} from '@shoutem/ui';
import { connect } from 'react-redux';
import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';
import { PlacesListPhoto } from '../screens/PlacesListPhoto';

import { CmsListScreen } from 'shoutem.cms';

import {
  find,
} from '@shoutem/redux-io';

class PlacesListIcon extends PlacesListPhoto {
  static propTypes = {
    ...PlacesListPhoto.propTypes,
  }

  renderRow(place) {
    const { navigateTo } = this.props;

    return (
      <TouchableOpacity
        onPress={() => navigateTo({
          screen: ext('PlaceDetails'),
          props: { place },
        })}
      >
        <Divider styleName="line" />
        <Row>
          <Image styleName="small rounded-corners" source={this.getPlaceImage(place)} />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={2}>{place.name}</Subtitle>
            <View styleName="horizontal">
              <Caption>{place.address}</Caption>
            </View>
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  (state) => state[ext()].allPlaces,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  navigateTo,
  find,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PlacesListIcon'), {})(PlacesListIcon),
);
