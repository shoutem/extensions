import React from 'react';
import autoBindReact from 'auto-bind/react';
import { connect } from 'react-redux';
import { CmsListScreen } from 'shoutem.cms';
import { navigateTo } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import LargeVideoView from '../components/LargeVideoView';
import { ext } from '../const';
import { VIDEOS_SCHEMA } from '../redux';

export class VideosList extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: VIDEOS_SCHEMA,
    };
  }

  openDetailsScreen(video) {
    navigateTo(ext('VideoDetails'), { video });
  }

  renderRow(video) {
    return <LargeVideoView video={video} onPress={this.openDetailsScreen} />;
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  state => state[ext()].latestVideos,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps();

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('VideosList'))(VideosList));
