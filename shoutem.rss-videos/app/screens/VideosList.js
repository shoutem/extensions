import React from 'react';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import _ from 'lodash';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { RssListScreen } from 'shoutem.rss';
import LargeVideoView from '../components/LargeVideoView';
import { ext, RSS_VIDEOS_SCHEMA, VIDEOS_COLLECTION_TAG } from '../const';
import { getVideosFeed } from '../redux';

export class VideosList extends RssListScreen {
  static propTypes = {
    ...RssListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      ...this.state,
      schema: RSS_VIDEOS_SCHEMA,
      tag: VIDEOS_COLLECTION_TAG,
    };

    autoBind(this);
  }

  openDetailsScreen(video) {
    const { feedUrl } = this.props;
    const { id } = video;

    navigateTo(ext('VideoDetails'), {
      id,
      feedUrl,
      analyticsPayload: {
        itemId: video.id,
        itemName: video.title,
      },
    });
  }

  renderRow(video) {
    return <LargeVideoView video={video} onPress={this.openDetailsScreen} />;
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { shortcut } = getRouteParams(ownProps);
  const shortcutId = _.get(shortcut, 'id');
  const feedUrl = _.get(shortcut, 'settings.feedUrl');
  const data = getVideosFeed(state, feedUrl);

  return {
    shortcutId,
    feedUrl,
    data,
  };
};

export const mapDispatchToProps = RssListScreen.createMapDispatchToProps();

export default connect(mapStateToProps, mapDispatchToProps)(VideosList);
