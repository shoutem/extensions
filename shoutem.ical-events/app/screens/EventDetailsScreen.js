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
  Row,
  Screen,
  ScrollView,
  ShareButton,
  SimpleHtml,
  Subtitle,
  Text,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { InlineMap } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  getRouteParams,
  navigateTo,
} from 'shoutem.navigation';
import { openURL } from 'shoutem.web-view';
import { ext } from '../const';
import {
  addToCalendar,
  formatToAllDayDate,
  formatToLocalDate,
} from '../services/Calendar';
import isValidEvent from '../services/isValidEvent';

/**
 * Extracts location into marker out of event.
 *
 * @param event
 * @returns {*}
 */
const getEventLocation = event => ({
  latitude: parseFloat(_.get(event, 'geo.lat')),
  longitude: parseFloat(_.get(event, 'geo.lon')),
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

  getNavBarProps() {
    const { event, screenSettings } = getRouteParams(this.props);
    const title = _.get(event, 'name', '');

    const headerStyles =
      screenSettings.navigationBarStyle === 'clear'
        ? composeNavigationStyles(['clear'])
        : {};

    return {
      headerRight: this.renderShare,
      ...headerStyles,
      title,
    };
  }

  renderShare() {
    const { event } = getRouteParams(this.props);
    const title = _.get(event, 'name', '');
    const rsvpLink = _.get(event, 'rsvpLink', '');

    if (_.isEmpty(rsvpLink)) {
      return null;
    }

    return <ShareButton styleName="clear" title={title} url={rsvpLink} />;
  }

  addToCalendar() {
    const { event } = getRouteParams(this.props);
    addToCalendar(event);
  }

  openMapScreen() {
    const { event } = getRouteParams(this.props);

    navigateTo(ext('EventMapScreen'), {
      title: `Map View - ${event.name}`,
      event: {
        title: _.get(event, 'name'),
        marker: getEventLocation(event),
      },
    });
  }

  handleOpenURL() {
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

  renderHeadlineDetails(event, darkened = true, navBarClear = true) {
    const textColorStyle = darkened ? '' : 'bright';
    const paddingTop = navBarClear ? 90 : 0;

    return (
      <View styleName="vertical h-center" style={{ paddingTop }}>
        <Title styleName={`${textColorStyle} md-gutter-bottom`}>
          {event.name.toUpperCase()}
        </Title>
        <Caption styleName={`${textColorStyle} sm-gutter-bottom`}>
          {event.allDay
            ? formatToAllDayDate(event.start, event.end)
            : formatToLocalDate(event.start)}
        </Caption>
        {!event.allDay && (
          <>
            <Divider styleName="line small center" />
            <Caption styleName={`${textColorStyle} md-gutter-bottom`}>
              {formatToLocalDate(event.end)}
            </Caption>
          </>
        )}
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
      <TouchableOpacity onPress={this.handleOpenURL}>
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

  renderHeader(event) {
    return (
      <Tile animationName="hero" styleName="text-centric">
        {this.renderHeadlineDetails(event, true, true)}
        {this.renderAddToCalendarButton(false)}
      </Tile>
    );
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

  renderScreen(fullScreen) {
    const { event } = getRouteParams(this.props);
    const screenStyleName = `${fullScreen ? ' full-screen' : ''} paper`;

    return (
      <Screen styleName={screenStyleName}>{this.renderData(event)}</Screen>
    );
  }

  render() {
    return this.renderScreen(true);
  }
}

export default connectStyle(ext('EventDetailsScreen'))(EventDetailsScreen);
