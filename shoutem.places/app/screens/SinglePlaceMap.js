import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { NavigationBar } from 'shoutem.navigation';
import { View, Screen, TouchableOpacity, Icon } from '@shoutem/ui';
import { MapList } from '../components';
import { getMapUrl } from '../services/places';

export default class SinglePlaceMap extends PureComponent {
  static propTypes = {
    place: PropTypes.object,
    title: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.openMapLink = this.openMapLink.bind(this);
    this.renderRightNavBarComponent = this.renderRightNavBarComponent.bind(
      this,
    );
  }

  getNavBarProps() {
    return {
      title: this.props.title.toUpperCase() || '',
      renderRightComponent: this.renderRightNavBarComponent,
    };
  }

  openMapLink() {
    const { location = {} } = this.props.place;
    const { latitude, longitude, formattedAddress } = location;

    if (latitude && longitude) {
      Linking.openURL(getMapUrl(latitude, longitude, formattedAddress));
    }
  }

  renderRightNavBarComponent() {
    return (
      <View styleName="container md-gutter-right">
        <TouchableOpacity onPress={this.openMapLink}>
          <Icon name="directions" />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { place } = this.props;

    return (
      <Screen>
        <NavigationBar {...this.getNavBarProps()} />
        <MapList places={[place]} selectedPlace={place} />
      </Screen>
    );
  }
}
