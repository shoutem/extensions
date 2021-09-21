import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { InlineMap } from 'shoutem.application';
import { connectStyle } from '@shoutem/theme';
import {
  ScrollView,
  Screen,
  Title,
  Caption,
  Icon,
  SimpleHtml,
  View,
  Button,
  Text,
  Divider,
  TouchableOpacity,
  Row,
  Subtitle,
  ShareButton,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  getRouteParams,
  navigateTo,
} from 'shoutem.navigation';
import { openURL } from 'shoutem.web-view';
import { formatDate, addToCalendar } from '../shared/Calendar';
import isValidEvent from '../shared/isValidEvent';
import { ext } from '../const';

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
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

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

  openURL() {
    const { event } = getRouteParams(this.props);
    openURL(event.rsvpLink, event.name);
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

  renderRsvpButton(event) {
    return event.rsvpLink ? (
      <TouchableOpacity onPress={this.openURL}>
        <Divider styleName="line" />
        <Row styleName="small">
          <Icon name="add-event" />
          <Text>{I18n.t('shoutem.cms.rsvpButton')}</Text>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
      </TouchableOpacity>
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
        {this.renderRsvpButton(event)}
        {this.renderInformation(event)}
        {this.renderMap(event)}
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

export default connectStyle(ext('EventDetailsScreen'))(EventDetailsScreen);
