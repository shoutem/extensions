import React, { useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { I18n } from 'shoutem.i18n';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { openURL } from 'shoutem.web-view';
import { connectStyle } from '@shoutem/theme';
import {
  View,
  Screen,
  Subtitle,
  ImageBackground,
  Button,
  Icon,
  Text,
  Tile,
  Heading,
  ScrollView,
  Title,
  Caption,
  Divider,
  TouchableOpacity,
  Row,
  SimpleHtml,
  ShareButton,
} from '@shoutem/ui';
import { ext } from '../const';

function ProductDetails(props) {
  const { navigation } = props;
  const { product } = getRouteParams(props);

  const getNavBarProps = () => {
    return {
      ...composeNavigationStyles(['clear', 'solidify']),
      headerRight: props => {
        if (!product.link) {
          return null;
        }

        return (
          <ShareButton
            // eslint-disable-next-line react/prop-types
            iconProps={{ style: props.tintColor }}
            styleName="clear"
            title={product.name}
            url={product.link}
          />
        );
      },
      title: product.name || '',
    };
  };

  useEffect(() => {
    navigation.setOptions(getNavBarProps());
  }, []);

  const onBuyPress = () => {
    openURL(product.link, product.name);
  };

  const renderProductPriceInfo = () => {
    const oldPrice = product.oldPrice;

    if (!oldPrice) {
      return (
        <Heading styleName="sm-gutter-bottom">{product.currentPrice}</Heading>
      );
    }

    return (
      <View styleName="vertical h-center">
        <Subtitle styleName="line-through">{oldPrice}</Subtitle>
        <Heading styleName="sm-gutter-bottom">{product.currentPrice}</Heading>
      </View>
    );
  };

  const renderBuyField = () => {
    if (!product.link) {
      return null;
    }

    return (
      <Button styleName="md-gutter-top" onPress={onBuyPress}>
        <Text>{product.buyTitle}</Text>
      </Button>
    );
  };

  const renderNoImage = () => {
    if (product.image) {
      return (
        <ImageBackground
          animationName="hero"
          styleName="large-square placeholder"
          source={{ uri: _.get(product, 'image.url') }}
          key={product.name}
        >
          <Tile animationName="hero" styleName="text-centric fill-parent">
            <Title
              numberOfLines={2}
              styleName="xl-gutter-top md-gutter-bottom lg-gutter-horizontal"
            >
              {product.name.toUpperCase()}
            </Title>
            {renderProductPriceInfo()}
            {renderBuyField()}
          </Tile>
        </ImageBackground>
      );
    }

    return (
      <ImageBackground
        animationName="hero"
        styleName="large-square placeholder"
      >
        <Tile animationName="hero" styleName="text-centric fill-parent">
          <Subtitle styleName="lg-gutter-top xl-gutter-bottom md-gutter-horizontal">
            {product.name.toUpperCase()}
          </Subtitle>
          {renderProductPriceInfo()}
          {renderBuyField()}
        </Tile>
      </ImageBackground>
    );
  };

  const renderInformation = () => {
    if (!product.description) {
      return null;
    }

    return (
      <View styleName="solid">
        <Divider styleName="section-header">
          <Caption>{I18n.t('shoutem.cms.descriptionTitle')}</Caption>
        </Divider>
        <SimpleHtml body={product.description} />
      </View>
    );
  };

  const renderDisclosureBuyLink = () => {
    if (!product.link) {
      return null;
    }

    return (
      <TouchableOpacity onPress={onBuyPress}>
        <Divider styleName="section-header">
          <Caption />
        </Divider>
        <Row>
          <Icon styleName="indicator" name="laptop" />
          <View styleName="vertical">
            <Subtitle>{product.buyTitle}</Subtitle>
            <Text numberOfLines={1}>{product.link}</Text>
          </View>
          <Icon styleName="indicator disclosure" name="right-arrow" />
        </Row>
      </TouchableOpacity>
    );
  };

  return (
    <Screen styleName="paper">
      <ScrollView>
        {renderNoImage()}
        {renderInformation()}
        {renderDisclosureBuyLink()}
        <Divider styleName="section-header" />
      </ScrollView>
    </Screen>
  );
}

ProductDetails.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default connectStyle(ext('ProductDetails'))(ProductDetails);
