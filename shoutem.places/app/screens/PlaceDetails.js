import React, { PureComponent } from 'react';
import { Linking } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Divider,
  Icon,
  Row,
  Screen,
  ScrollView,
  SimpleHtml,
  Subtitle,
  Text,
  Tile,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { InlineMap } from 'shoutem.application';
import { Favorite } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  getRouteParams,
  navigateTo,
} from 'shoutem.navigation';
import { openURL } from 'shoutem.web-view';
import { PlaceImageGallery } from '../components';
import { ext } from '../const';
import { getMapUrl, getPlaceImages } from '../services/places';

export class PlaceDetails extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: ext('places'),
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());
  }

  getNavBarProps() {
    const { schema } = this.state;
    const { place, screenSettings } = getRouteParams(this.props);
    const images = getPlaceImages(place);
    const title = place.name || '';
    const headerRight = props => (
      <Favorite
        // eslint-disable-next-line react/prop-types
        iconProps={{ style: props.tintColor }}
        item={place}
        navBarButton
        schema={schema}
      />
    );

    if (screenSettings.navigationBarStyle === 'solid') {
      return {
        headerRight,
        title,
      };
    }

    const resolvedStyle =
      _.size(images) >= 1
        ? { ...composeNavigationStyles(['clear', 'solidify']) }
        : { ...composeNavigationStyles(['noBorder', 'solidify']) };

    return {
      ...resolvedStyle,
      headerRight,
      title,
    };
  }

  openURL() {
    const { place } = getRouteParams(this.props);
    openURL(place.rsvpLink, place.name);
  }

  openWebLink() {
    const { place } = getRouteParams(this.props);
    openURL(place.url);
  }

  openMapLink() {
    const { place } = getRouteParams(this.props);
    const location = _.get(place, 'location', {});
    const { latitude, longitude, formattedAddress } = location;

    if (latitude && longitude) {
      Linking.openURL(getMapUrl(latitude, longitude, formattedAddress));
    }
  }

  openEmailLink() {
    const { place } = getRouteParams(this.props);
    Linking.openURL(`mailto:${place.mail}`);
  }

  openPhoneLink() {
    const { place } = getRouteParams(this.props);
    Linking.openURL(`tel:${place.phone}`);
  }

  openMapScreen() {
    const { place } = getRouteParams(this.props);
    navigateTo(ext('SinglePlaceMap'), {
      place,
      title: place.name,
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
        <TouchableOpacity onPress={this.openMapScreen}>
          <InlineMap
            initialRegion={region}
            markers={[marker]}
            selectedMarker={marker}
            styleName="medium-tall"
          >
            <View styleName="fill-parent overlay vertical v-center h-center">
              <Subtitle numberOfLines={1}>{item.name}</Subtitle>
              <Caption numberOfLines={2}>{formattedAddress}</Caption>
            </View>
          </InlineMap>
        </TouchableOpacity>
      </View>
    );
  }

  renderDescription(place) {
    return place.description ? (
      <View styleName="solid">
        <Divider styleName="section-header">
          <Caption>{I18n.t('shoutem.cms.descriptionTitle')}</Caption>
        </Divider>
        <SimpleHtml body={place.description} />
      </View>
    ) : null;
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
    const { place } = getRouteParams(this.props);
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
    const { place } = getRouteParams(this.props);
    const location = _.get(place, 'location', {});

    return (
      <Screen styleName="paper">
        <ScrollView>
          {this.renderLeadImage(place)}
          {this.renderOpeningHours(place)}
          {this.renderButtons()}
          {this.renderInlineMap(place)}
          {this.renderDescription(place)}
          {this.renderDisclosureButton(
            place.url,
            I18n.t('shoutem.cms.websiteButton'),
            'web',
            this.openWebLink,
          )}
          {this.renderDisclosureButton(
            location.formattedAddress,
            I18n.t('shoutem.cms.directionsButton'),
            'pin',
            this.openMapLink,
          )}
          {this.renderDisclosureButton(
            place.mail,
            I18n.t('shoutem.cms.emailButton'),
            'email',
            this.openEmailLink,
          )}
          {this.renderDisclosureButton(
            place.phone,
            I18n.t('shoutem.cms.phoneButton'),
            'call',
            this.openPhoneLink,
          )}
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('PlaceDetails'))(PlaceDetails);
