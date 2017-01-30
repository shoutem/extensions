import React, {
  Component
} from 'react';
import {
  Linking
} from 'react-native';
import {
  ScrollView,
  TouchableOpacity,
  Icon,
  Row,
  Subtitle,
  Caption,
  Button,
  Text,
  Title,
  View,
  Image,
  Divider,
  Overlay,
  Tile,
  Screen
} from '@shoutem/ui';

import { InlineMap, RichMedia } from '@shoutem/ui-addons';
import { connect } from 'react-redux';
import { navigateTo } from '@shoutem/core/navigation';
import { NavigationBar } from '@shoutem/ui/navigation';
import { openURL } from 'shoutem.web-view';
import { bindActionCreators } from 'redux';

export class PlaceDetails extends Component {
  static propTypes = {
    place: React.PropTypes.object.isRequired,
    openURL: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.createWebLink = this.createWebLink.bind(this);
    this.createMapLink = this.createMapLink.bind(this);
    this.createEmailLink = this.createEmailLink.bind(this);
    this.createPhoneLink = this.createPhoneLink.bind(this);
  }

  getNavBarProps() {
    const { place } = this.props;
    return {
      styleName: place.image ? 'clear' : 'no-border',
      animationName: 'solidify',
    };
  }

  createInlineMap() {
    const { place } = this.props;
    Linking.openURL('geo:' + place.latitude + ',' + place.longitude);
  }

  renderInlineMap(place) {
    if (place.latitude && place.longitude) {
      return (
        <View styleName="collapsed">
          <TouchableOpacity onPress={this.createInlineMap(place)}>
            <InlineMap
              initialRegion={{ longitude: parseFloat(place.longitude),
                latitude: parseFloat(place.latitude),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              markers={[{
                longitude: parseFloat(place.longitude),
                latitude: parseFloat(place.latitude),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }]}
              styleName="medium-tall"
            >
              <Overlay styleName="fill-parent">
                <View styleName="vertical v-center h-center">
                  <Subtitle numberOfLines={1} >{place.name}</Subtitle>
                  <Caption numberOfLines={2} >{place.address}</Caption>
                </View>
              </Overlay>
            </InlineMap>
          </TouchableOpacity>
        </View>
      );
    }
  }

  getPlaceImage(place) {
    return place.image ? { uri: place.image.url } : require('../assets/data/no_image.png');
  }

  renderLeadImage(place) {
    return (
      <Image styleName="large-portrait" source={this.getPlaceImage(place)}>
        <Tile>
          <Title>{place.name.toUpperCase()}</Title>
          <Caption styleName="sm-gutter-top">{place.address}</Caption>
          <Button styleName="md-gutter-top"><Text>CHECK IN HERE</Text></Button>
        </Tile>
      </Image>
    );
  }

  createWebLink() {
    const { place, openURL } = this.props;
    openURL(place.url);
  }

  createMapLink() {
    const { place } = this.props;
    if (place.latitude && place.longitude) {
      Linking.openURL('geo:' + place.latitude + ',' + place.longitude);
    }
  }

  createEmailLink() {
    const { place } = this.props;
    Linking.openURL('mailto:' + place.mail);
  }

  createPhoneLink() {
    const { place } = this.props;
    Linking.openURL('tel:' + place.phone);
  }

  renderDescription(place) {
    if (place.description) {
      return (
        <Tile>
          <Divider styleName="section-header">
            <Caption>LOCATION INFO</Caption>
          </Divider>
          <RichMedia body={place.description} />
          <Divider styleName="line" />
        </Tile>
      );
    }
  }

  renderOpeningHours(place) {
    if (place.openingHours) {
      return (
        <Tile>
          <Divider styleName="section-header">

            <Caption>OPEN HOURS</Caption>
          </Divider>
          <Text styleName="md-gutter">{place.openingHours}</Text>
        </Tile>
      );
    }
  }

  renderDisclosureButton(title, subtitle, icon, onPressCallback) {
    if (!title) {
      return null;
    }
    return (
      <TouchableOpacity onPress={onPressCallback}>
        <Divider styleName="line" />
        <Row>
          <Icon name={icon} />
          <View styleName="vertical">
            <Subtitle>{subtitle}</Subtitle>
            <Text numberOfLines={1}>{title}</Text>
          </View>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }

  render() {
    const { place } = this.props;
    return (
      <Screen styleName="full-screen">
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          {this.renderLeadImage(place)}
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

export default connect(
  undefined,
  (dispatch) => bindActionCreators({ navigateTo, openURL }, dispatch),
)(PlaceDetails);
