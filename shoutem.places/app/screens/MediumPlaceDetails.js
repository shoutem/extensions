import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Favorite } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import { NavigationBar, navigateTo } from 'shoutem.navigation';
import { openURL } from 'shoutem.web-view';
import { connectStyle } from '@shoutem/theme';
import { ScrollView, Caption, Title, Screen, Tile, View } from '@shoutem/ui';
import { getPlaceImages } from '../services/places';
import { PlaceImageGallery } from '../components';
import { ext } from '../const';
import { PlaceDetails } from './PlaceDetails';

class MediumPlaceDetails extends PlaceDetails {
  static propTypes = {
    ...PlaceDetails.PropTypes,
  };

  getNavBarProps() {
    const { place } = this.props;
    const { schema } = this.state;
    const images = getPlaceImages(place);

    return {
      renderRightComponent: () => (
        <View styleName="container" virtual>
          <Favorite item={place} navBarButton schema={schema} />
        </View>
      ),
      styleName: _.size(images) >= 1 ? 'clear' : 'no-border',
      animationName: place.image ? 'solidify' : 'boxing',
      title: place.name,
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
    const { place } = this.props;
    const { location = {} } = place;
    return (
      <Screen styleName="paper">
        <NavigationBar {...this.getNavBarProps()} />
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

export default connect(undefined, { navigateTo, openURL })(
  connectStyle(ext('MediumPlaceDetails'))(MediumPlaceDetails),
);
