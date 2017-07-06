import React, { Component } from 'react';

import { connect } from 'react-redux';

import {
  Button,
  Caption,
  Divider,
  Icon,
  Image,
  Row,
  Screen,
  ScrollView,
  Subtitle,
  Text,
  Tile,
  Title,
  TouchableOpacity,
  View,
  Html,
} from '@shoutem/ui';

import {
  find,
} from '@shoutem/redux-io';

import {
  Linking,
  Platform,
} from 'react-native';

import {
  InlineMap,
 } from '@shoutem/ui-addons';

import {
  navigateTo,
  openInModal,
} from '@shoutem/core/navigation';

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

import { connectStyle } from '@shoutem/theme';
import { openURL } from 'shoutem.web-view';
import {
  ext,
} from '../../const';

import {
  placeShape,
} from '../../components/shapes';

/* eslint-disable class-methods-use-this */

const { func } = React.PropTypes;

export class PlaceDetails extends Component {
  static propTypes = {
    // The place
    place: placeShape.isRequired,
    openURL: func,
    navigateTo: func,
  };

  constructor(props) {
    super(props);

    this.collectPoints = this.collectPoints.bind(this);
    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.openWebLink = this.openWebLink.bind(this);
    this.openMapLink = this.openMapLink.bind(this);
    this.openEmailLink = this.openEmailLink.bind(this);
    this.openPhoneLink = this.openPhoneLink.bind(this);
    this.openMapScreen = this.openMapScreen.bind(this);
    this.openURL = this.openURL.bind(this);
  }

  getNavBarProps() {
    const { place: { image, name = '' } } = this.props;

    return {
      styleName: image ? 'clear' : 'no-border',
      title: name.toUpperCase(),
    };
  }

  openURL() {
    const { place: { rsvpLink, name }, openURL } = this.props;
    openURL(rsvpLink, name);
  }

  openWebLink() {
    const { place: { url }, openURL } = this.props;
    openURL(url);
  }

  openMapLink() {
    const { location = {} } = this.props.place;
    const { latitude, longitude, formattedAddress } = location;

    const resolvedScheme = (Platform.OS === 'ios') ? `http://maps.apple.com/?ll=${latitude},${longitude}&q=${formattedAddress}` :
    `geo:${latitude},${longitude}?q=${formattedAddress}`;

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

  renderLeadImage() {
    const { place: { image, location = {}, name } } = this.props;
    const { formattedAddress = '' } = location;

    return (
      <Image
        styleName="large"
        source={image && { uri: image.url }}
        animationName="hero"
      >
        <Tile>
          <Title>{name.toUpperCase()}</Title>
          <Caption styleName="sm-gutter-top">{formattedAddress}</Caption>
        </Tile>
      </Image>
    );
  }

  renderInlineMap() {
    const { place: { location = {}, name } } = this.props;

    const { latitude, longitude, formattedAddress } = location;

    if (!latitude || !longitude) {
      return null;
    }

    const marker = {
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
    };
    const region = {
      ...marker,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    return (
      <View styleName="solid">
        <TouchableOpacity
          onPress={this.openMapScreen}
        >
          <InlineMap
            initialRegion={region}
            markers={[marker]}
            selectedMarker={marker}
            styleName="medium-tall"
          >
            <View styleName="fill-parent overlay vertical v-center h-center">
              <Subtitle numberOfLines={1} >{name}</Subtitle>
              <Caption numberOfLines={2} >{formattedAddress}</Caption>
            </View>
          </InlineMap>
        </TouchableOpacity>
      </View>
    );
  }

  renderDescription() {
    const { place: { description } } = this.props;

    if (description) {
      return (
        <Tile>
          <Divider styleName="section-header">
            <Caption>LOCATION INFO</Caption>
          </Divider>
          <View styleName="md-gutter">
            <Html body={description} />
          </View>
          <Divider styleName="line" />
        </Tile>
      );
    }
    return null;
  }

  renderOpeningHours() {
    const { place: { openingHours } } = this.props;

    if (openingHours) {
      return (
        <Tile>
          <Divider styleName="section-header">
            <Caption>OPEN HOURS</Caption>
          </Divider>
          <Text styleName="md-gutter">{openingHours}</Text>
        </Tile>
      );
    }
    return null;
  }

  renderRsvpButton() {
    const { place: { rsvpLink } } = this.props;

    return rsvpLink ? (
      <Button onPress={this.openURL}>
        <Text>RESERVATION</Text>
      </Button>
    ) : null;
  }

  renderButtons() {
    return (
      <Row>
        <View styleName="horizontal h-center">
          {this.renderRsvpButton()}
        </View>
      </Row>
    );
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
    const { location = {} } = place;
    return (
      <Screen styleName="full-screen paper">
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          {this.renderLeadImage()}
          {this.renderOpeningHours()}
          {this.renderButtons()}
          {this.renderInlineMap()}
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

export const mapDispatchToProps = {
  find,
  navigateTo,
  openInModal,
  openURL,
};

export default connect(undefined, mapDispatchToProps)(
connectStyle(ext('PlaceDetails'))(PlaceDetails));
