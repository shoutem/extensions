import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
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
import { UNIVERSAL_LINK_TYPE, UniversalLinkButton } from 'shoutem.cms';
import { Favorite } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  getRouteParams,
  navigateTo,
} from 'shoutem.navigation';
import { PlaceDealsSection, PlaceImageGallery } from '../components';
import { ext } from '../const';
import { dealsExtensionInstalled } from '../services';
import { getPlaceImages } from '../services/places';

export class PlaceDetails extends PureComponent {
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
    return (
      <UniversalLinkButton
        link={place.rsvpLink}
        title={I18n.t('shoutem.cms.rsvpButton')}
        iconName="Book Online"
      />
    );
  }

  renderLinkButtons(place) {
    return (
      <>
        <UniversalLinkButton
          type={UNIVERSAL_LINK_TYPE.LOCATION}
          location={place.location}
          title={I18n.t('shoutem.cms.directionsButton')}
          subtitle={place.location?.formattedAddress}
        />
        <UniversalLinkButton
          link={place.url}
          title={I18n.t('shoutem.cms.websiteButton')}
          subtitle={place.url}
        />
        <UniversalLinkButton
          type={UNIVERSAL_LINK_TYPE.EMAIL}
          link={place.mail}
          title={I18n.t('shoutem.cms.emailButton')}
          subtitle={place.mail}
        />
        <UniversalLinkButton
          type={UNIVERSAL_LINK_TYPE.PHONE}
          link={place.phone}
          title={I18n.t('shoutem.cms.phoneButton')}
          subtitle={place.phone}
        />
        <UniversalLinkButton
          link={place.twitter}
          title={I18n.t('shoutem.cms.twitterButton')}
          subtitle={place.twitter}
          iconName="tweet"
        />
        <UniversalLinkButton
          link={place.instagram}
          title={I18n.t('shoutem.cms.instagramButton')}
          subtitle={place.instagram}
          iconName="instagram"
        />
        <UniversalLinkButton
          link={place.facebook}
          title={I18n.t('shoutem.cms.facebookButton')}
          subtitle={place.facebook}
          iconName="facebook"
        />
        <UniversalLinkButton
          link={place.tiktok}
          title={I18n.t('shoutem.cms.tiktokButton')}
          subtitle={place.tiktok}
          iconName="tiktok"
        />
        <UniversalLinkButton
          link={place.linkedin}
          title={I18n.t('shoutem.cms.linkedInButton')}
          subtitle={place.linkedin}
          iconName="linkedin"
        />
      </>
    );
  }

  renderPlaceDeals() {
    if (!dealsExtensionInstalled()) {
      return null;
    }

    const { place } = getRouteParams(this.props);

    return <PlaceDealsSection placeId={place.id} />;
  }

  render() {
    const { place } = getRouteParams(this.props);

    return (
      <Screen styleName="paper">
        <ScrollView>
          {this.renderLeadImage(place)}
          {this.renderOpeningHours(place)}
          {this.renderRsvpButton(place)}
          {this.renderInlineMap(place)}
          {this.renderDescription(place)}
          {this.renderLinkButtons(place)}
          {this.renderPlaceDeals()}
        </ScrollView>
      </Screen>
    );
  }
}

PlaceDetails.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default connectStyle(ext('PlaceDetails'))(PlaceDetails);
