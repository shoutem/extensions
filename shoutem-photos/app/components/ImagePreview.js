import React, {
  PropTypes,
  Component,
} from 'react';

import {
  Image,
  View,
} from 'react-native';

import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import { makeZoomable } from '@shoutem/animation';

import { fallbackImage } from '../index.js';

const ZoomableImage = makeZoomable(Image);

const propTypes = {
  data: PropTypes.object.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  onPressImage: PropTypes.func
};

/**
 * Renders an ImagePreview which shows an inline image preview.
 * When clicked, the image is displayed in full screen.
 */
class ImagePreview extends Component {
  constructor(props) {
    super(props);
    this.onPressImage = this.onPressImage.bind(this);
    this.onZoom = this.onZoom.bind(this);
  }

  onPressImage() {
    this.props.onPress && this.props.onPress();
  }

  onZoom(){
    this.props.onZoom && this.props.onZoom();
  }

  render() {
    const { data, width, height } = this.props;
    const maxWidth = width ? width : 300;
    const maxHeight = height ? height : 300;
    const imageUrl = _.get(data, 'image.url') || _.get(data, 'imageAttachments[0].url');
    
    const source = imageUrl ? {uri:imageUrl} : fallbackImage
    return (
        <View 
          style={style.container}>
            <ZoomableImage
              style={style.image}
              componentWidth={maxWidth}
              componentHeight={maxHeight}
              source={source}
              resizeMode={'contain'}
              onPress={this.onPressImage}
              onZoom={this.onZoom}
            />
        </View>
    );
  } 
}

const style = {
  container: {
    flex: 1,
  },
  image:{
    flex: 1
  },
};

ImagePreview.propTypes = propTypes;

const StyledImagePreview = connectStyle('shoutem.ui.ImagePreview', style)(ImagePreview);

export {
  StyledImagePreview as ImagePreview,
};
