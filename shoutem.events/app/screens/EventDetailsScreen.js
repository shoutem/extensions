import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Divider,
  Icon,
  Screen,
  ScrollView,
  ShareButton,
  SimpleHtml,
  Subtitle,
  Text,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { InlineMap } from 'shoutem.application';
import { UNIVERSAL_LINK_TYPE, UniversalLinkButton } from 'shoutem.cms';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  getRouteParams,
  navigateTo,
} from 'shoutem.navigation';
import { ext } from '../const';
import { addToCalendar, formatDate } from '../shared/Calendar';
import isValidEvent from '../shared/isValidEvent';

/**
 * Extracts `coordinate` value for given event.
 *
 * @param event
 * @returns {*}
 */
const getEventLocationCoordinate = (event, coordinate) =>
  parseFloat(_.get(event, `location.${coordinate}`));

/**
 * Extracts location into marker out of event.
 *
 * @param event
 * @returns {*}
 */
const getEventLocation = event => ({
  latitude: getEventLocationCoordinate(event, 'latitude'),
  longitude: getEventLocationCoordinate(event, 'longitude'),
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
});

export class EventDetailsScreen extends PureComponent {
  constructor(props, context) {
    super(props, context);

    autoBindReact(this);
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());
  }

  isNavigationBarClear() {
    const { screenSettings } = getRouteParams(this.props);
    return screenSettings.navigationBarStyle === 'clear';
  }

  getNavBarProps() {
    const { event, title = '' } = getRouteParams(this.props);

    if (this.isNavigationBarClear()) {
      if (event.image) {
        // If navigation bar is clear and image exists, navigation bar should be initially clear
        // but after scrolling down navigation bar should appear (solidify animation)

        return {
          ...composeNavigationStyles(['clear', 'solidify']),
          headerRight: props => {
            if (!event.rsvpLink) {
              return null;
            }

            return (
              <ShareButton
                // eslint-disable-next-line react/prop-types
                iconProps={{ style: props.tintColor }}
                styleName="clear"
                title={event.name}
                url={event.rsvpLink}
              />
            );
          },
          title,
        };
      }

      // If navigation bar is clear, but there is no image, navigation bar should be set to solid,
      // but boxing animation should be applied so title appears after scrolling down
      return {
        ...composeNavigationStyles(['boxing']),
        headerRight: props => {
          if (!event.rsvpLink) {
            return null;
          }

          return (
            <ShareButton
              // eslint-disable-next-line react/prop-types
              iconProps={{ style: props.tintColor }}
              styleName="clear"
              title={event.name}
              url={event.rsvpLink}
            />
          );
        },
        title,
      };
    }

    return {
      headerRight: props => (
        <ShareButton
          // eslint-disable-next-line react/prop-types
          iconProps={{ style: props.tintColor }}
          styleName="clear"
          title={event.name}
          url={event.rsvpLink}
        />
      ),
      title: event.name,
    };
  }

  addToCalendar() {
    const { event } = getRouteParams(this.props);

    addToCalendar(event);
  }

  openMapScreen() {
    const { event } = getRouteParams(this.props);

    navigateTo(ext('SingleEventMapScreen'), {
      title: `Map View - ${event.name}`,
      event: {
        title: _.get(event, 'name'),
        marker: getEventLocation(event),
      },
    });
  }

  renderMap(event) {
    if (!isValidEvent(event)) {
      return null;
    }

    const location = getEventLocation(event);

    return (
      <TouchableOpacity onPress={this.openMapScreen}>
        <InlineMap
          initialRegion={location}
          markers={[location]}
          selectedMarker={location}
          styleName="medium-tall"
        >
          <View styleName="vertical fill-parent v-end h-center lg-gutter-bottom">
            <Subtitle>{_.get(event, 'location.formattedAddress')}</Subtitle>
          </View>
        </InlineMap>
      </TouchableOpacity>
    );
  }

  renderHeadlineDetails(event, darkened = true) {
    const textColorStyle = darkened ? '' : 'bright';

    return (
      <View styleName="vertical h-center">
        <Title styleName={`${textColorStyle} md-gutter-bottom`}>
          {event.name.toUpperCase()}
        </Title>
        <Caption styleName={`${textColorStyle} sm-gutter-bottom`}>
          {formatDate(event.startTime)}
        </Caption>
        <Divider styleName="line small center" />
        <Caption styleName={`${textColorStyle} md-gutter-bottom`}>
          {formatDate(event.endTime)}
        </Caption>
      </View>
    );
  }

  renderAddToCalendarButton(darkened = true) {
    return (
      <Button
        onPress={this.addToCalendar}
        styleName={`${darkened ? 'secondary' : ''} md-gutter-top`}
      >
        <Icon name="add-event" />
        <Text>{I18n.t(ext('addToCalendarButton'))}</Text>
      </Button>
    );
  }

  renderOpeningHours(event) {
    return event.openingHours ? (
      <View styleName="solid">
        <Divider styleName="section-header">
          <Caption>{I18n.t('shoutem.cms.openHours')}</Caption>
        </Divider>
        <SimpleHtml body={event.openingHours} />
      </View>
    ) : null;
  }

  renderWheelchairAccesibility(event) {
    const { style } = this.props;

    return event.wheelchairAccessibility ? (
      <View styleName="solid md-gutter-bottom">
        <View
          styleName="horizontal md-gutter-left md-gutter-vertical v-center"
          style={style.sectionHeader}
        >
          <Icon name="wheelchair" />
          <Caption styleName="sm-gutter-left">
            {I18n.t(ext('wheelchairFriendly'))}
          </Caption>
          <Divider styleName="line" />
        </View>
      </View>
    ) : null;
  }

  renderInformation(event) {
    return event.description ? (
      <View styleName="solid">
        <Divider styleName="section-header">
          <Caption>{I18n.t('shoutem.cms.descriptionTitle')}</Caption>
        </Divider>
        <SimpleHtml body={event.description} />
      </View>
    ) : null;
  }

  renderData(event) {
    return (
      <ScrollView>
        {this.renderHeader(event)}
        <UniversalLinkButton
          link={event.rsvpLink}
          title={I18n.t('shoutem.cms.rsvpButton')}
          iconName="rsvp"
        />
        {this.renderOpeningHours(event)}
        {this.renderWheelchairAccesibility(event)}
        {this.renderInformation(event)}
        {this.renderMap(event)}
        <UniversalLinkButton
          type={UNIVERSAL_LINK_TYPE.LOCATION}
          location={event.location}
          title={I18n.t('shoutem.cms.directionsButton')}
          subtitle={event.location?.formattedAddress}
        />
        <UniversalLinkButton
          link={event.web}
          title={I18n.t('shoutem.cms.websiteButton')}
          subtitle={event.web}
        />
        <UniversalLinkButton
          type={UNIVERSAL_LINK_TYPE.EMAIL}
          link={event.mail}
          title={I18n.t('shoutem.cms.emailButton')}
          subtitle={event.mail}
        />
        <UniversalLinkButton
          type={UNIVERSAL_LINK_TYPE.PHONE}
          link={event.phone}
          title={I18n.t('shoutem.cms.phoneButton')}
          subtitle={event.phone}
        />
        <UniversalLinkButton
          link={event.twitter}
          title={I18n.t('shoutem.cms.twitterButton')}
          subtitle={event.twitter}
          iconName="tweet"
        />
        <UniversalLinkButton
          link={event.instagram}
          title={I18n.t('shoutem.cms.instagramButton')}
          subtitle={event.instagram}
          iconName="instagram"
        />
        <UniversalLinkButton
          link={event.facebook}
          title={I18n.t('shoutem.cms.facebookButton')}
          subtitle={event.facebook}
          iconName="facebook"
        />
        <UniversalLinkButton
          link={event.tiktok}
          title={I18n.t('shoutem.cms.tiktokButton')}
          subtitle={event.tiktok}
          iconName="tiktok"
        />
        <UniversalLinkButton
          link={event.linkedin}
          title={I18n.t('shoutem.cms.linkedInButton')}
          subtitle={event.linkedin}
          iconName="linkedin"
        />
      </ScrollView>
    );
  }

  renderScreen() {
    const { event } = getRouteParams(this.props);

    return <Screen styleName="paper">{this.renderData(event)}</Screen>;
  }

  render() {
    return this.renderScreen();
  }
}

EventDetailsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('EventDetailsScreen'))(EventDetailsScreen);
