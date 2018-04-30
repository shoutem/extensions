import PropTypes from 'prop-types';
import React from 'react';

import { connectStyle } from '@shoutem/theme';
import {
  Screen,
  ImageBackground,
  Divider,
  Subtitle,
  Overlay,
  Title,
  Text,
  Tile,
  ScrollView,
  View,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';
import { ext } from '../const';

class MenuDetailsScreen extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
  };

  render() {
    const { item } = this.props;

    const price = item.price ? (
      <Overlay style={{ backgroundColor: 'white' }}>
        <Subtitle styleName="sm-gutter-horizontal">{item.price}</Subtitle>
      </Overlay>) : null;

    return (
      <Screen styleName="full-screen paper">
        <NavigationBar
          styleName="clear"
          animationName="solidify"
          title={item.name}
        />
        <ScrollView>
          <ImageBackground
            styleName="large-square placeholder"
            animationName="hero"
            source={{ uri: item.image ? item.image.url : undefined }}
          >
            <Tile animationName="hero">
              <Title styleName="md-gutter-bottom">{item.name.toUpperCase()}</Title>
              {price}
            </Tile>
          </ImageBackground>
          <Divider styleName="line" />
          <View style={{ backgroundColor: 'white' }}>
            <Text styleName="multiline md-gutter-horizontal lg-gutter-vertical">
              {item.description}
            </Text>
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('MenuDetailsScreen'), {})(MenuDetailsScreen);
