import React from 'react';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import SmallVideoView from '../components/SmallVideoView';
import { ext } from '../const';
import { mapDispatchToProps, mapStateToProps, VideosList } from './VideosList';

class SmallVideosList extends VideosList {
  renderRow(video) {
    return <SmallVideoView video={video} onPress={this.openDetailsScreen} />;
  }
}

export default connectStyle(ext('SmallVideosList'))(
  connect(mapStateToProps, mapDispatchToProps)(SmallVideosList),
);
