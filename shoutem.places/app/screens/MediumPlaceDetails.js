import React from 'react';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import { Caption, Screen, ScrollView, Tile, Title } from '@shoutem/ui';
import { Favorite } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { PlaceImageGallery } from '../components';
import { ext } from '../const';
import { getPlaceImages } from '../services/places';
import { PlaceDetails } from './PlaceDetails';

class MediumPlaceDetails extends PlaceDetails {
  static propTypes = {
    ...PlaceDetails.PropTypes,
  };

  getNavBarProps() {
    const { place, screenSettings } = getRouteParams(this.props);
    const { schema } = this.state;

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

    const images = getPlaceImages(place);
    const resolvedStyle =
      _.size(images) >= 1
        ? { ...composeNavigationStyles(['clear', 'solidify']) }
        : { ...composeNavigationStyles(['noBorder', 'solidify']) };
    const resolvedAnimation = !place.image
      ? { ...composeNavigationStyles(['boxing']) }
      : {};

    return {
      ...resolvedAnimation,
      ...resolvedStyle,
      headerRight,
      title,
    };
  }

  renderLeadImage(place) {
    return (
      <PlaceImageGallery
        imageAnimationName="hero"
        imageOverlay={false}
        images={getPlaceImages(place)}
        imageStyleName="large"
        place={place}
      />
    );
  }

  renderPlaceInfo(place) {
    const { location = {} } = place;
    const { formattedAddress = '' } = location;

    return (
      <Tile styleName="text-centric">
        <Title
          numberOfLines={3}
          styleName={`md-gutter-bottom ${place.image ? '' : 'xl-gutter-top'}`}
        >
          {place.name.toUpperCase()}
        </Title>
        <Caption styleName="centered sm-gutter-top lg-gutter-bottom">
          {formattedAddress}
        </Caption>
      </Tile>
    );
  }

  render() {
    const { place } = getRouteParams(this.props);
    const location = _.get(place, 'location', {});

    return (
      <Screen styleName="paper">
        <ScrollView>
          {this.renderLeadImage(place)}
          {this.renderPlaceInfo(place)}
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

export default connectStyle(ext('MediumPlaceDetails'))(MediumPlaceDetails);
