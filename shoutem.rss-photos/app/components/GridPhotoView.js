import React, { PureComponent } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, View } from '@shoutem/ui';
import { assets } from 'shoutem.layouts';

/**
 * A component used to render a single grid photo item
 */
export default class GridPhotoView extends PureComponent {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    const { onPress, photo } = this.props;

    if (_.isFunction(onPress)) {
      onPress(photo);
    }
  }

  render() {
    const { photo, width, height } = this.props;

    const photoImage = _.get(photo, 'source');
    const photoSource = photoImage || assets.noImagePlaceholder;

    // resizeMethod="resize" significantly improves image
    // rendering performance on Android for some reason:
    // https://github.com/facebook/react-native/issues/10569#issuecomment-273392208
    return (
      <View key={photo.id}>
        <TouchableOpacity onPress={this.onPress}>
          <Image
            styleName="placeholder"
            style={{ width, height }}
            source={photoSource}
            resizeMethod="resize"
          />
        </TouchableOpacity>
      </View>
    );
  }
}

GridPhotoView.propTypes = {
  photo: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
};

GridPhotoView.defaultProps = {
  height: undefined,
  width: undefined,
};
