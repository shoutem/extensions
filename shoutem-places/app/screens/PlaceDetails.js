import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  ScrollView,
  TouchableOpacity,
  Icon,
  Row,
  Subtitle,
  Caption,
  Text,
  Title,
  View,
  Image,
  Divider,
  Tile,
  Screen,
} from '@shoutem/ui';
import {
  Linking,
  Platform,
} from 'react-native';
import { InlineMap, RichMedia } from '@shoutem/ui-addons';
import { navigateTo } from '@shoutem/core/navigation';
import { NavigationBar } from '@shoutem/ui/navigation';
import { connectStyle } from '@shoutem/theme';

import { openURL } from 'shoutem.web-view';
import { ext } from '../const';

export class PlaceDetails extends Component {
  static propTypes = {
    place: React.PropTypes.object.isRequired,
    openURL: React.PropTypes.func,
    navigateTo: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.openWebLink = this.openWebLink.bind(this);
    this.openMapLink = this.openMapLink.bind(this);
    this.openEmailLink = this.openEmailLink.bind(this);
    this.openPhoneLink = this.openPhoneLink.bind(this);
    this.openMapScreen = this.openMapScreen.bind(this);
  }

  getNavBarProps() {
    const { place } = this.props;
    return {
      styleName: place.image ? 'clear' : 'no-border',
      animationName: 'solidify',
      title: place.name,
    };
  }

  openWebLink() {
    const { place, openURL } = this.props;
    openURL(place.url);
  }

  openMapLink() {
    const { location = {} } = this.props.place;
    const { latitude, longitude, formattedAddress } = location;

    const resolvedScheme = (Platform.OS === 'ios') ? `http://maps.apple.com/?ll=${latitude},${longitude}&q=${formattedAddress}` :
    `geo:${latitude},${longitude}(${formattedAddress})`;

    if (latitude && longitude) {
      Linking.openURL(resolvedScheme);
    }
  }

  openEmailLink() {
    const { place } = this.props;
    Linking.openURL(`mailto:${place.mail}`);
  }

  openPhoneLink() {
    const { place } = this.props;
    Linking.openURL(`tel:${place.phone}`);
  }

  openMapScreen() {
    const { navigateTo, place } = this.props;
    navigateTo({
      screen: ext('SinglePlaceMap'),
      props: {
        place,
        title: place.name,
      },
    });
  }

  renderLeadImage(place) {
    return (
      <Image
        styleName="large-portrait"
        source={place.image ? { uri: place.image.url } : undefined}
        animationName="hero"
      >
        <Tile>
          <Title>{place.name.toUpperCase()}</Title>
          <Caption styleName="sm-gutter-top">{place.address}</Caption>
        </Tile>
      </Image>
    );
  }

  renderInlineMap(item) {
    const { location = {} } = item;
    const { latitude, longitude } = location;

    if (!latitude || !longitude) {
      return null;
    }

    return (
      <View>
        <TouchableOpacity
          onPress={this.openMapScreen}
        >
          <InlineMap
            initialRegion={{ longitude: parseFloat(longitude),
              latitude: parseFloat(latitude),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            markers={[{
              longitude: parseFloat(longitude),
              latitude: parseFloat(latitude),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }]}
            styleName="medium-tall"
          >
            <View styleName="fill-parent overlay vertical v-center h-center">
              <Subtitle numberOfLines={1} >{item.name}</Subtitle>
              <Caption numberOfLines={2} >{item.resolvedAddress}</Caption>
            </View>
          </InlineMap>
        </TouchableOpacity>
      </View>
    );
  }

  renderDescription(place) {
    if (place.description) {
      return (
        <Tile>
          <Divider styleName="section-header">
            <Caption>LOCATION INFO</Caption>
          </Divider>
          <RichMedia body={place.description} />
          <Divider styleName="line" />
        </Tile>
      );
    }
    return null;
  }

  renderOpeningHours(place) {
    if (place.openingHours) {
      return (
        <Tile>
          <Divider styleName="section-header">

            <Caption>OPEN HOURS</Caption>
          </Divider>
          <Text styleName="md-gutter">{place.openingHours}</Text>
        </Tile>
      );
    }
    return null;
  }

  renderDisclosureButton(title, subtitle, icon, onPressCallback) {
    if (!title) {
      return null;
    }
    return (
      <TouchableOpacity onPress={onPressCallback}>
        <Divider styleName="line" />
        <Row>
          <Icon styleName="indicator" name={icon} />
          <View styleName="vertical">
            <Subtitle>{subtitle}</Subtitle>
            <Text numberOfLines={1}>{title}</Text>
          </View>
          <Icon styleName="indicator disclosure" name="right-arrow" />
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }

  render() {
    const { place } = this.props;
    const { location = {} } = this.props.place;
    return (
      <Screen styleName="full-screen paper">
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          {this.renderLeadImage(place)}
          {this.renderOpeningHours(place)}
          {this.renderInlineMap(place)}
          {this.renderDescription(place)}
          {this.renderDisclosureButton(place.url, 'Visit webpage', 'web', this.openWebLink)}
          {this.renderDisclosureButton(location.formattedAddress, 'Directions', 'pin',
          this.openMapLink)}
          {this.renderDisclosureButton(place.mail, 'Email', 'email', this.openEmailLink)}
          {this.renderDisclosureButton(place.phone, 'Phone', 'call', this.openPhoneLink)}
        </ScrollView>
      </Screen>
    );
  }
}

export default connect(undefined, { navigateTo, openURL })(
    connectStyle(ext('PlaceDetails'))(PlaceDetails),
  );
