import React, { PureComponent } from 'react';
import { Dimensions } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { View, Video, ListView } from '@shoutem/ui';

export class VideoGallery extends PureComponent {
  renderVideo(video) {
    const source = { uri: video.src };

    return (
      <View styleName="md-gutter-bottom md-gutter-horizontal">
        <Video width={Dimensions.get('window').width} source={source} />
      </View>
    );
  }

  render() {
    const { videos } = this.props;

    if (_.isEmpty(videos)) {
      return null;
    }

    return (
      <ListView
        data={videos}
        renderRow={this.renderVideo}
        showsVerticalScrollIndicator={false}
      />
    );
  }
}

VideoGallery.propTypes = {
  videos: PropTypes.array.isRequired,
};
