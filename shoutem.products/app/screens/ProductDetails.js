import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  Heading,
  ImageBackground,
  Screen,
  ScrollView,
  ShareButton,
  SimpleHtml,
  Subtitle,
  Tile,
  Title,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { openURL } from 'shoutem.web-view';
import { BuyButton, DisclosureBuyButton } from '../components';
import { ext } from '../const';

function ProductDetails(props) {
  const { navigation } = props;
  const { addAuthHeaderToBuyLink, product } = getRouteParams(props);

  useEffect(() => {
    const navBarProps = {
      ...composeNavigationStyles(['clear', 'solidify']),
      headerRight: headerProps => {
        if (!product.link) {
          return null;
        }

        return (
          <ShareButton
            iconProps={{ style: headerProps?.tintColor }}
            styleName="clear"
            title={product.name}
            url={product.link}
          />
        );
      },
      title: product.name || '',
    };

    navigation.setOptions(navBarProps);
  }, [product, navigation]);

  function onBuyPress(accessToken) {
    if (addAuthHeaderToBuyLink && accessToken) {
      const url = {
        uri: product.link,
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      openURL(url, product.name);
    }

    openURL(product.link, product.name);
  }

  function renderProductPriceInfo() {
    const { oldPrice } = product;

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
  }

  function renderNoImage() {
    if (product.image) {
      return (
        <ImageBackground
          animationName="hero"
          styleName="large-square placeholder"
          source={{ uri: product.image.url }}
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
            <BuyButton onBuyPress={onBuyPress} product={product} />
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
          <BuyButton onBuyPress={onBuyPress} product={product} />
        </Tile>
      </ImageBackground>
    );
  }

  function renderInformation() {
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
  }

  return (
    <Screen styleName="paper">
      <ScrollView>
        {renderNoImage()}
        {renderInformation()}
        {!!product?.link && (
          <DisclosureBuyButton onBuyPress={onBuyPress} product={product} />
        )}
        <Divider styleName="section-header" />
      </ScrollView>
    </Screen>
  );
}

ProductDetails.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default connectStyle(ext('ProductDetails'))(ProductDetails);
