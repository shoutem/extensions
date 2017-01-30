import React, {
  Component
} from 'react';
import {
  ScrollView,
  Caption,
  Button,
  Text,
  Title,
  Image,
  Divider,
  Tile,
  Screen
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { connect } from 'react-redux';
import { navigateTo } from '@shoutem/core/navigation';
import { NavigationBar } from '@shoutem/ui/navigation';
import { PlaceDetails } from './PlaceDetails';

import { openURL } from 'shoutem.web-view';
import { ext } from '../const.js';

class PlaceDetailsMedium extends PlaceDetails {
  static propTypes = {
    ...PlaceDetails.PropTypes,
  };

  renderLeadImage(place) {
    if (place.image) {
      return (
        <Image styleName="large hero" source={{ uri: place.image.url }} />
      );
    }
  }

  renderUnderImage(place) {
    if (!place.image) {
      return (
        <Tile styleName="text-centric">
          <Image styleName="large" source={{ uri: 'http://i.imgur.com/aYxs2id.png' }}>
            <Title styleName="md-gutter-bottom" numberOfLines={3}>{place.name.toUpperCase()}</Title>
            <Caption styleName="centered">{place.address}</Caption>
            <Divider />
            <Button styleName="dark" onPress={place.handleClick}><Text>CHECK IN HERE</Text></Button>
          </Image>
        </Tile>);
    }
    return (
      <Tile styleName="text-centric">
        <Image styleName="large-wide" source={{ uri: 'http://i.imgur.com/aYxs2id.png' }}>
          <Title styleName="md-gutter-bottom" numberOfLines={3}>{place.name.toUpperCase()}</Title>
          <Caption styleName="centered">{place.address}</Caption>
          <Divider />
          <Button styleName="dark" onPress={place.handleClick}><Text>CHECK IN HERE</Text></Button>
        </Image>
      </Tile>);
  }

  render() {
    const { place } = this.props;
    return (
      <Screen styleName="full-screen">
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>

          {this.renderLeadImage(place)}
          {this.renderUnderImage(place)}
          {this.renderOpeningHours(place)}
          {this.renderInlineMap(place)}

          {this.renderDescription(place)}
          {this.renderDisclosureButton(place.url, 'Visit webpage', 'web', this.createWebLink)}
          {this.renderDisclosureButton(place.address, 'Directions', 'pin', this.createMapLink)}
          {this.renderDisclosureButton(place.mail, 'Email', 'email', this.createEmailLink)}
          {this.renderDisclosureButton(place.phone, 'Phone', 'call', this.createPhoneLink)}
        </ScrollView>
      </Screen>
    );
  }
}

export default connect(undefined, { navigateTo, openURL })(
    connectStyle(ext('PlaceDetailsMedium'))(PlaceDetailsMedium),
  );
