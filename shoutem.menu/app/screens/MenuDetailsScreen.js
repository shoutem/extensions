import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NavigationBar } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import {
  Screen,
  ImageBackground,
  ScrollView,
  Divider,
  Subtitle,
  Overlay,
  Title,
  Text,
  Tile,
  View,
} from '@shoutem/ui';
import { ext } from '../const';

class MenuDetailsScreen extends PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
  };

  render() {
    const { item } = this.props;

    const price = item.price ? (
      <Overlay>
        <Subtitle styleName="sm-gutter-horizontal">{item.price}</Subtitle>
      </Overlay>
    ) : null;

    return (
      <Screen styleName="paper">
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
              <Title styleName="md-gutter-bottom">
                {item.name.toUpperCase()}
              </Title>
              {price}
            </Tile>
          </ImageBackground>
          <Divider styleName="line" />
          <View>
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
