import React from 'react';
import _ from 'lodash';
import {
  TouchableOpacity,
  View,
} from '@shoutem/ui';

import { Image } from 'react-native';

import { fallbackImage } from '../index.js';

/**
 * A component used to render a single grid photo item
 */
export default class GridPhotoView extends React.Component {
  static propTypes = {
    onPress: React.PropTypes.func,
    photo: React.PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress && this.props.onPress(this.props.photo);
  }

  render() {
    const { photo, width, height } = this.props;
    const imageUrl = _.get(photo, 'image.url') || _.get(photo, 'imageAttachments[0].url');
    
    return (
      <View key={photo.id}>
        <TouchableOpacity onPress={this.onPress} >
            <Image
                style={{width, height}} 
                source={{ uri: imageUrl }}
                defaultSource={fallbackImage}
            />
          </TouchableOpacity>
      </View>
    );
  }
}