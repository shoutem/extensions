import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Linking } from 'react-native';

import {
  ScrollView,
  TouchableOpacity,
  Icon,
  Row,
  Subtitle,
  Caption,
  Text,
  View,
  Divider,
  Tile,
  Screen,
  Button,
  SimpleHtml,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { NavigationBar, navigateTo } from 'shoutem.navigation';
import { InlineMap } from 'shoutem.application';
import { Favorite } from 'shoutem.favorites';
import { openURL } from 'shoutem.web-view';
import { I18n } from 'shoutem.i18n';

import _ from 'lodash';

import PlaceImageGallery from '../components/PlaceImageGallery';
import { getPlaceImages, getMapUrl } from '../services/places';
import { ext } from '../const';

export class PlaceDetails extends PureComponent {
  static propTypes = {
    place: PropTypes.object.isRequired,
    openURL: PropTypes.func,
    navigateTo: PropTypes.func,
    hasFavorites: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.openWebLink = this.openWebLink.bind(this);
    this.openMapLink = this.openMapLink.bind(this);
    this.openEmailLink = this.openEmailLink.bind(this);
    this.openPhoneLink = this.openPhoneLink.bind(this);
    this.openMapScreen = this.openMapScreen.bind(this);
    this.openURL = this.openURL.bind(this);

    this.state = {
      ...this.state,
      schema: ext('places'),
    };
  }

  getNavBarProps() {
    const { place } = this.props;
    const { schema } = this.state;
    const images = getPlaceImages(place);

    return {
      renderRightComponent: () => (
        <View styleName="container" virtual>
          <Favorite
            item={place}
            navBarButton
            schema={schema}
          />
        </View>
      ),
      styleName: _.size(images) >= 1 ? 'clear' : 'no-border',
      animationName: 'solidify',
      title: place.name,
    };
  }

  openURL() {
    const { place, openURL } = this.props;

    openURL(place.rsvpLink, place.name);
  }

  openWebLink() {
    const { place, openURL } = this.props;
    openURL(place.url);
  }

  openMapLink() {
    const { location = {} } = this.props.place;
    const { latitude, longitude, formattedAddress } = location;

    if (latitude && longitude) {
      Linking.openURL(getMapUrl(latitude, longitude, formattedAddress));
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
      <PlaceImageGallery
        imageAnimationName="hero"
        images={getPlaceImages(place)}
        imageStyleName="large-portrait"
        place={place}
      />
    );
  }

  renderInlineMap(item) {
    const { location = {} } = item;
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
              <Subtitle numberOfLines={1} >{item.name}</Subtitle>
              <Caption numberOfLines={2} >{formattedAddress}</Caption>
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
            <Caption>{I18n.t('shoutem.cms.descriptionTitle')}</Caption>
          </Divider>
          <SimpleHtml body={place.description} />
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
            <Caption>{I18n.t('shoutem.cms.openHours')}</Caption>
          </Divider>
          <Text styleName="md-gutter">{place.openingHours}</Text>
        </Tile>
      );
    }
    return null;
  }

  renderRsvpButton(place) {
    return place.rsvpLink ? (
      <Button onPress={this.openURL}>
        <Text>{I18n.t('shoutem.cms.rsvpButton')}</Text>
      </Button>
    ) : null;
  }

  renderButtons() {
    const { place } = this.props;
    return (
      <Row>
        <View styleName="horizontal h-center">
          {this.renderRsvpButton(place)}
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
          <Icon name={icon} styleName="indicator" />
          <View styleName="vertical">
            <Subtitle>{subtitle}</Subtitle>
            <Text numberOfLines={1}>{title}</Text>
          </View>
          <Icon name="right-arrow" styleName="indicator disclosure" />
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
          {this.renderButtons()}
          {this.renderInlineMap(place)}
          {this.renderDescription(place)}
          {this.renderDisclosureButton(place.url, I18n.t('shoutem.cms.websiteButton'), 'web', this.openWebLink)}
          {this.renderDisclosureButton(location.formattedAddress, I18n.t('shoutem.cms.directionsButton'), 'pin', this.openMapLink)}
          {this.renderDisclosureButton(place.mail, I18n.t('shoutem.cms.emailButton'), 'email', this.openEmailLink)}
          {this.renderDisclosureButton(place.phone, I18n.t('shoutem.cms.phoneButton'), 'call', this.openPhoneLink)}
        </ScrollView>
      </Screen>
    );
  }
}

export default connect(undefined, { navigateTo, openURL })(
  connectStyle(ext('PlaceDetails'))(PlaceDetails),
);
