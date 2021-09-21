import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
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

const MenuDetailsScreen = props => {
  const { navigation } = props;
  const { item } = getRouteParams(props);

  useEffect(() => {
    navigation.setOptions({
      ...composeNavigationStyles(['clear', 'solidify']),
      title: item.name || '',
    });
  });

  const price = item.price ? (
    <Overlay>
      <Subtitle styleName="sm-gutter-horizontal">{item.price}</Subtitle>
    </Overlay>
  ) : null;

  return (
    <Screen styleName="paper">
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
};

MenuDetailsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default connectStyle(ext('MenuDetailsScreen'), {})(MenuDetailsScreen);
