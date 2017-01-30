import React, {
  Component
} from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  Tile,
  Title,
  Subtitle,
  Caption,
  Divider,
} from '@shoutem/ui';
import { connect } from 'react-redux';
import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';

import { CmsListScreen } from 'shoutem.cms';

import {
  find,
} from '@shoutem/redux-io';

export class PlacesListPhoto extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
  }

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.getNavBarProps = this.getNavBarProps.bind(this);

    this.state = {
      ...this.state,
      schema: ext('places'),
      renderCategoriesInline: true,
    };
  }

  getNavBarProps() {
    const { data, navigateTo } = this.props;

    return {
      ...super.getNavBarProps(),
      renderRightComponent() {
        return (
        <View styleName="container md-gutter-right">
          <TouchableOpacity
            onPress={() => navigateTo({
              screen: ext('MapList'),
              props: {
                places: data,
              },
            })}
          >
            <Subtitle>Map</Subtitle>
          </TouchableOpacity>
        </View>
        );
      },
    };
  }

  getPlaceImage(place) {
    return place.image ? { uri: place.image.url } : require('../assets/data/no_image.png');
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
        <Image styleName="large-banner" source={this.getPlaceImage(place)}>
          <Tile>
            <Title styleName="vertical" numberOfLines={2}>{place.name.toUpperCase()}</Title>
            <Caption styleName="vertical">{place.address}</Caption>
          </Tile>
        </Image>
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
  connectStyle(ext('PlacesListPhoto'), {})(PlacesListPhoto),
);
