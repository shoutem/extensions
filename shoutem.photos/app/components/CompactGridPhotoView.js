import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Image } from '@shoutem/ui';
import { BasePhotoView } from './BasePhotoView';

/**
 * A component used to render a single grid photo item
 */
export default class CompactGridPhotoView extends BasePhotoView {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
  };

  render() {
    const { photo, width, height } = this.props;
    const source = _.get(photo, 'source');

    // resizeMethod="resize" significantly improves image
    // rendering performance on Android for some reason:
    // https://github.com/facebook/react-native/issues/10569#issuecomment-273392208
    return (
      <View key={photo.id}>
        <TouchableOpacity onPress={this.onPress}>
          <Image
            styleName="placeholder"
            style={{ width, height }}
            source={source}
            resizeMethod="resize"
          />
        </TouchableOpacity>
      </View>
    );
  }
}
