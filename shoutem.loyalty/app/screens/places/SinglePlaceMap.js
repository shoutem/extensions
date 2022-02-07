import React, { PureComponent } from 'react';
import { Linking, Platform } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Screen } from '@shoutem/ui';
import { getRouteParams, HeaderIconButton } from 'shoutem.navigation';
import MapList from '../../components/MapList';
import { placeShape } from '../../components/shapes';

export default class SinglePlaceMap extends PureComponent {
  static propTypes = {
    // The place
    place: placeShape,
    // Screen title
    title: PropTypes.string,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({ ...this.getNavBarProps() });
  }

  getNavBarProps() {
    return {
      headerRight: this.renderRightNavBarComponent,
    };
  }

  openMapLink() {
    const { place } = getRouteParams(this.props);
    const location = _.get(place, 'location', {});
    const { latitude, longitude, formattedAddress } = location;

    const resolvedScheme =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?ll=${latitude},${longitude}&q=${formattedAddress}`
        : `geo:${latitude},${longitude}?q=${formattedAddress}`;

    if (latitude && longitude) {
      Linking.openURL(resolvedScheme);
    }
  }

  renderRightNavBarComponent(props) {
    return (
      <HeaderIconButton
        {...props}
        onPress={this.openMapLink}
        iconName="directions"
      />
    );
  }

  render() {
    const { place } = getRouteParams(this.props);

    return (
      <Screen>
        <MapList places={[place]} selectedPlace={place} />
      </Screen>
    );
  }
}
