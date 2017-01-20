import React, {
  Component
} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  HeroHeader,
  FadeOut,
  FadeIn,
  ZoomOut,
  ScrollDriver,
  Parallax,
} from '@shoutem/animation';
import {
  Icon,
  Row,
  Subtitle,
  Caption,
  Heading,
  Button,
  Text,
  IconButton,
  Title,
  View,
  Image,
  Divider,
  Overlay,
  Tile,
  Screen
} from '@shoutem/ui';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { navigateTo } from '@shoutem/core/navigation';

import { MapView, InlineMap, } from '@shoutem/ui-addons';

import { openURL } from 'shoutem.web-view';

class PlacesDetailsLarge extends Component {



renderInlineMap(place) {
    if (place.latitude && place.longitude) {

      return (
        <View styleName="collapsed">
          <TouchableOpacity onPress={() => Linking.openURL('geo:'+place.latitude+','+place.longitude)}>
            <InlineMap
              initialRegion={{ longitude: parseFloat(place.longitude),
                                latitude: parseFloat(place.latitude),
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01 }}
              markers={[{ longitude: parseFloat(place.longitude),
                                latitude: parseFloat(place.latitude)}]}
              style={{ width: 375, height: 160 }}>
              <Overlay styleName="fill-parent secondary">
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


  renderRowCall(place) {
  if (place.phone)
    {return (
      <TouchableOpacity onPress={() => Linking.openURL('tel:'+place.phone)}>
          <Row>
            <Icon name="call" />
            <View styleName="vertical">
              <Subtitle>Phone</Subtitle>
              <Text>{place.phone}</Text>
            </View><Icon styleName="disclosure" name="right-arrow" />
          </Row>
          <Divider styleName="line"/>
          </TouchableOpacity>);}
}

renderRowLeadimage(place) {

  if (place.image)
    {return (



          <Image styleName="large-banner hero" source={{ uri: place.image.url }}>
          </Image>


       );}
      }

renderRowUnderImage(place) {

  if (!place.image)
  return (<Tile>
      <Image styleName="large" source={{ uri: 'http://i.imgur.com/aYxs2id.png' }}>
        <Title styleName="md-gutter-bottom" numberOfLines={2}>{place.name.toUpperCase()}</Title>
        <Caption styleName="centered">{place.address}</Caption>
        <Divider/>
        <Button styleName="secondary" onPress={place.handleClick}><Text>CHECK IN HERE</Text></Button>
      </Image>
    </Tile>);

  else
    return (
    <Tile>
      <Image styleName="large-wide" source={{ uri: 'http://i.imgur.com/aYxs2id.png' }}>

        <Title styleName="md-gutter-bottom" numberOfLines={2}>{place.name.toUpperCase()}</Title>
        <Caption styleName="centered">{place.address}</Caption>
        <Divider/>
        <Button styleName="secondary" onPress={place.handleClick}><Text>CHECK IN HERE</Text></Button>

      </Image>
    </Tile>);
      }

renderRowEmail(place) {
  if (place.mail)
    {return (
      <TouchableOpacity onPress={() => Linking.openURL('mailto:'+place.email)}>
      <Row>
          <Icon name="email" />
          <View styleName="vertical">
            <Subtitle>Email</Subtitle>
            <Text>{place.mail}</Text>
          </View>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
        <Divider styleName="line" />
        </TouchableOpacity>);}
}

renderRowWeb(place) {
const {openURL} = this.props;

  if (place.url)
    {return (
      <TouchableOpacity onPress={() => openURL(place.url)}>
      <Divider styleName="line"/>
        <Row>
          <Icon name="web" />
          <View styleName="vertical">
            <Subtitle>Visit webpage</Subtitle>
            <Text>{place.url}</Text>
          </View>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
        <Divider styleName="line"/>
      </TouchableOpacity>
      );}
}

renderRowDir(place) {
  if ((place.latitude)&&(place.longitude))
    {return (
      <TouchableOpacity onPress={() => Linking.openURL('geo:'+place.latitude+','+place.longitude)}>
      <Row>
          <Icon name="pin" />
          <View styleName="vertical">
            <Subtitle >Directions</Subtitle>
            <Text numberOfLines={1}>{place.address}</Text>
          </View>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
        <Divider styleName="line"/>
        </TouchableOpacity>
        );}
}

renderRowOpenh(place) {
  if (place.openingHours)
    {return (
       <Tile>
        <Divider styleName="section-header">

          <Caption>OPEN HOURS</Caption>

        </Divider>
        <Text styleName="md-gutter">{place.openingHours}</Text>
      </Tile>
   );}
}

renderRowDesc(place) {
  if (place.description)
    {return (
       <Tile>
       <Divider styleName="section-header">
          <Caption>LOCATION INFO</Caption>
        </Divider>
        <Text styleName="md-gutter">{place.description}</Text>
      </Tile>

   );}
}

  render() {
    const { place, setNavBarProps } = this.props;


this.props.setNavBarProps({
      styleName: 'clear',
      rightComponent: <Icon name="add-to-favorites"  color="white"/>
    });

    if(!place.image){
      this.props.setNavBarProps({
        styleName: 'clear_black no-border',
        rightComponent: <Icon name="add-to-favorites"  color="black"/>
      });

    };

    return (
      <Screen styleName="full-screen">
      <ScrollView>

        {this.renderRowLeadimage(place)}
        {this.renderRowUnderImage(place)}

        {this.renderRowOpenh(place)}
        {this.renderInlineMap(place)}
        {this.renderRowDesc(place)}
        {this.renderRowWeb(place)}
        {this.renderRowCall(place)}
        {this.renderRowDir(place)}
        {this.renderRowEmail(place)}

        <Row>
          <Icon name="add-to-favorites" />
          <View styleName="vertical">
            <Subtitle>Add to favorites</Subtitle>
          </View>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
        </ScrollView>
      </Screen>
    );
  }
}

export default connect(
  undefined,
  (dispatch) => bindActionCreators({ navigateTo, openURL }, dispatch)
)(PlacesDetailsLarge)

