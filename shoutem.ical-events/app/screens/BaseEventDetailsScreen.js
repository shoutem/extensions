import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import _ from 'lodash';

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
} from '@shoutem/ui';

import { I18n } from 'shoutem.i18n';
import { InlineMap } from 'shoutem.application';
import { NavigationBar } from 'shoutem.navigation'

import { formatToLocalDate, addToCalendar } from '../services/Calendar';
import isValidEvent from '../services/isValidEvent';
import { ext } from '../const';

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

export class BaseEventDetailsScreen extends PureComponent {
  static propTypes = {
    event: PropTypes.object.isRequired,
    openURL: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.addToCalendar = this.addToCalendar.bind(this);
    this.openMapScreen = this.openMapScreen.bind(this);
    this.renderRsvpButton = this.renderRsvpButton.bind(this);
    this.openURL = this.openURL.bind(this);
  }

  resolveNavBarProps(options = {}) {
    const { event } = this.props;

    return {
      share: {
        title: event.name,
        link: event.rsvpLink,
      },
      title: event.name,
      ...options,
    };
  }

  addToCalendar() {
    addToCalendar(this.props.event);
  }

  openMapScreen() {
    const { event, navigateTo } = this.props;
    navigateTo({
      screen: ext('EventMapScreen'),
      title: `Map View - ${event.name}`,
      props: {
        title: _.get(event, 'name'),
        marker: getEventLocation(event),
      },
    });
  }

  openURL() {
    const { event, openURL } = this.props;

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
    const paddingTop = navBarClear ? 45 : 0;

    return (
      <View virtual style={{ paddingTop: paddingTop }}>
        <Title styleName={`${textColorStyle} md-gutter-bottom`}>
          {event.name.toUpperCase()}
        </Title>
        <Caption styleName={`${textColorStyle} sm-gutter-bottom`}>
          {formatToLocalDate(event.start)}
        </Caption>
        <Divider styleName="line small center" />
        <Caption styleName={`${textColorStyle} md-gutter-bottom`}>
          {formatToLocalDate(event.end)}
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

  renderScreen(fullScreen) {
    const { event } = this.props;
    const screenStyleName = `${fullScreen ? ' full-screen' : ''} paper`;

    return (
      <Screen styleName={screenStyleName}>
        <NavigationBar {...this.resolveNavBarProps()} />
        {this.renderData(event)}
      </Screen>
    );
  }

  render() {
    return this.renderScreen(true);
  }
}
