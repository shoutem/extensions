import React, {
  Component,
} from 'react';
import _ from 'lodash';

import {
  TouchableOpacity,
  Image,
  View,
  Subtitle,
  Caption,
  Row,
  Icon,
  Divider,
} from '@shoutem/ui';

export default class ListProductView extends Component {
  constructor(props) {
    super(props);
    this.handleBuyPress = this.handleBuyPress.bind(this);
    this.handleItemPress = this.handleItemPress.bind(this);
  }

  handleBuyPress() {
    const { product, onBuyPress } = this.props;
    onBuyPress(product);
  }

  handleItemPress() {
    const { product, onPress } = this.props;
    onPress(product);
  }

  render() {
    const { product, onPress } = this.props;

    return (
      <TouchableOpacity onPress={this.handleItemPress}>
        <Row>
          <Image
            styleName="small"
            source={{ uri: _.get(product, 'image.url') }}
            defaultSource={require('../assets/images/image-fallback.png')}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle>{product.name}</Subtitle>
            <View styleName="horizontal">
              <Subtitle>{product.currentPrice}</Subtitle>
              <Caption styleName="line-through sm-gutter-left">{product.oldPrice}</Caption>
            </View>
          </View>
          <TouchableOpacity onPress={this.handleBuyPress} >
            <Icon name="add-to-cart" />
          </TouchableOpacity>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
