import React from 'react';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import SmallYoutubeView from '../components/SmallYoutubeView';
import { ext } from '../const';
import {
  mapDispatchToProps,
  mapStateToProps,
  YoutubeVideosScreen,
} from './YoutubeVideosScreen';

class YoutubeSmallListScreen extends YoutubeVideosScreen {
  renderRow(video) {
    return <SmallYoutubeView video={video} onPress={this.openDetailsScreen} />;
  }
}

export default connectStyle(ext('YoutubeSmallListScreen'))(
  connect(mapStateToProps, mapDispatchToProps)(YoutubeSmallListScreen),
);
