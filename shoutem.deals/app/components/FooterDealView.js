import React, { PureComponent } from 'react';
import { Dimensions } from 'react-native';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import {
  Caption,
  ImageBackground,
  Subtitle,
  Tile,
  TouchableOpacity,
} from '@shoutem/ui';
import { assets } from 'shoutem.layouts';

const imageWidth = Dimensions.get('window').width / 2 - 1;
const imageHeight = imageWidth - imageWidth / 3;

const styles = {
  image: {
    height: imageHeight,
    width: imageWidth,
  },
};

export default class FooterDealView extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handlePress() {
    const { deal, onPress } = this.props;

    onPress(deal);
  }

  render() {
    const { deal, label } = this.props;

    const dealImage = deal.image1
      ? { uri: deal.image1 }
      : assets.noImagePlaceholder;

    return (
      <TouchableOpacity onPress={this.handlePress}>
        <ImageBackground
          style={styles.image}
          styleName="placeholder"
          source={dealImage}
        >
          <Tile styleName="fill-parent md-gutter space-between">
            <Caption styleName="bold h-left">{label}</Caption>
            <Subtitle styleName="h-left" numberOfLines={2}>
              {deal.title}
            </Subtitle>
          </Tile>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

FooterDealView.propTypes = {
  deal: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};
