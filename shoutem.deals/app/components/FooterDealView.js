import _ from 'lodash';

import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';

import { Dimensions } from 'react-native';

import {
  Caption,
  ImageBackground,
  Subtitle,
  Tile,
  TouchableOpacity,
} from '@shoutem/ui';

const imageWidth = (Dimensions.get('window').width / 2) - 1;
const imageHeight = imageWidth - (imageWidth / 3);

const styles = {
  image: {
    height: imageHeight,
    width: imageWidth,
  },
};

export default class FooterDealView extends Component {

  static propTypes = {
    deal: PropTypes.object,
    label: PropTypes.string,
    onPress: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    this.props.onPress(this.props.deal);
  }

  render() {
    const { deal } = this.props;

    return (
      <TouchableOpacity onPress={this.handlePress}>
        <ImageBackground
          style={styles.image}
          styleName="placeholder"
          source={{ uri: _.get(deal, 'image1') }}
        >
          <Tile
            styleName="fill-parent md-gutter space-between"
          >
            <Caption styleName="bold h-left">{this.props.label}</Caption>
            <Subtitle styleName="h-left" numberOfLines={2}>{deal.title}</Subtitle>
          </Tile>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}
