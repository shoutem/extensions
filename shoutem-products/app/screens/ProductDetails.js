import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  View,
  Screen,
  Subtitle,
  Image,
  Button,
  Icon,
  Text,
  Tile,
  Heading,
  ScrollView,
} from '@shoutem/ui';
import { RichMedia } from '@shoutem/ui-addons';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import { openURL as openURLAction } from 'shoutem.web-view';

import { ext } from '../const';

export class ProductDetails extends React.Component {
  static propTypes = {
    product: React.PropTypes.object.isRequired,
    openURL: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.onBuyPress = this.onBuyPress.bind(this);
    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.renderProductPriceInfo = this.renderProductPriceInfo.bind(this);
  }

  onBuyPress() {
    const { product, openURL } = this.props;
    openURL(product.link, product.name);
  }

  getNavBarProps() {
    const { product } = this.props;
    return {
      styleName: 'clear',
      share: {
        link: product.link,
        title: product.name,
        text: product.description,
      },
      animationName: 'solidify',
    };
  }

  renderProductPriceInfo() {
    const { product } = this.props;
    const oldPrice = product.oldPrice;
    return (
      oldPrice ?
        <View styleName="vertical h-center">
          <Subtitle styleName="line-through lg-gutter-top">
            {oldPrice}
          </Subtitle>
          <Heading>
            {product.currentPrice}
          </Heading>
        </View> : <Heading styleName="xl-gutter-top">{product.currentPrice}</Heading>
    );
  }

  render() {
    const { product } = this.props;

    const imageUrl = _.get(product, 'image.url') ?
      { uri: _.get(product, 'image.url') } : require('../assets/images/image-fallback.png');

    return (
      <Screen styleName="full-screen paper">
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          <Image
            animationName="hero"
            styleName="large-square hero"
            source={imageUrl}
            key={product.name}
          >
            <Tile animationName="hero">
              <Heading styleName="md-gutter-top">{product.name.toUpperCase()}</Heading>
              <Button styleName="md-gutter-top" onPress={this.onBuyPress}>
                <Icon name="add-to-cart" />
                <Text>{product.buyTitle}</Text>
              </Button>
            </Tile>
          </Image>
          <View styleName="solid">
            <View styleName="lg-gutter-bottom vertical h-center">
              {this.renderProductPriceInfo()}
            </View>
            <RichMedia body={product.description} />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connect(undefined, { openURL: openURLAction })(
  connectStyle(ext('ProductDetails'))(ProductDetails),
);
