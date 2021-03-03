import React, { PureComponent } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { I18n } from 'shoutem.i18n';
import { NavigationBar } from 'shoutem.navigation';
import { openURL as openURLAction } from 'shoutem.web-view';
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
} from '@shoutem/ui';
import { ext } from '../const';

export class ProductDetails extends PureComponent {
  static propTypes = {
    product: PropTypes.object.isRequired,
    openURL: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.onBuyPress = this.onBuyPress.bind(this);
    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.renderProductPriceInfo = this.renderProductPriceInfo.bind(this);
    this.renderBuyField = this.renderBuyField.bind(this);
  }

  onBuyPress() {
    const { product, openURL } = this.props;
    openURL(product.link, product.name);
  }

  getNavBarProps() {
    const { product } = this.props;

    const share = {
      title: product.name,
      link: product.link,
    };

    return {
      styleName: 'clear',
      animationName: 'solidify',
      share,
      title: product.name,
    };
  }

  renderProductPriceInfo() {
    const { product } = this.props;

    const oldPrice = product.oldPrice;

    if (!oldPrice) {
      return (
        <Heading styleName="sm-gutter-bottom">{product.currentPrice}</Heading>
      );
    }

    return (
      <View virtual styleName="vertical h-center">
        <Subtitle styleName="line-through">{oldPrice}</Subtitle>
        <Heading styleName="sm-gutter-bottom">{product.currentPrice}</Heading>
      </View>
    );
  }

  renderBuyField() {
    const { product } = this.props;

    if (!product.link) {
      return null;
    }

    return (
      <Button styleName="md-gutter-top" onPress={this.onBuyPress}>
        <Text>{product.buyTitle}</Text>
      </Button>
    );
  }

  renderNoImage() {
    const { product } = this.props;

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
            {this.renderProductPriceInfo()}
            {this.renderBuyField()}
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
          {this.renderProductPriceInfo()}
          {this.renderBuyField()}
        </Tile>
      </ImageBackground>
    );
  }

  renderInformation() {
    const { product } = this.props;

    if (!product.description) {
      return null;
    }

    return (
      <Tile>
        <Divider styleName="section-header">
          <Caption>{I18n.t('shoutem.cms.descriptionTitle')}</Caption>
        </Divider>
        <SimpleHtml body={product.description} />
      </Tile>
    );
  }

  renderDisclosureBuyLink() {
    const { product } = this.props;

    if (!product.link) {
      return null;
    }

    return (
      <TouchableOpacity onPress={this.onBuyPress}>
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
  }

  render() {
    return (
      <Screen styleName="paper">
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          {this.renderNoImage()}
          {this.renderInformation()}
          {this.renderDisclosureBuyLink()}
          <Divider styleName="section-header" />
        </ScrollView>
      </Screen>
    );
  }
}

export default connect(undefined, { openURL: openURLAction })(
  connectStyle(ext('ProductDetails'))(ProductDetails),
);
