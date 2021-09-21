import React from 'react';
import autoBind from 'auto-bind';
import _ from 'lodash';
import { connect } from 'react-redux';
import { find, next, shouldRefresh } from '@shoutem/redux-io';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { RssListScreen } from 'shoutem.rss';
import LargeVideoView from '../components/LargeVideoView';
import { ext, RSS_VIDEOS_SCHEMA } from '../const';
import { getVideosFeed, fetchVideosFeed } from '../redux';

export class VideosList extends RssListScreen {
  static propTypes = {
    ...RssListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      ...this.state,
      schema: RSS_VIDEOS_SCHEMA,
    };

    autoBind(this);
  }

  componentDidMount() {
    const { data, fetchVideosFeed, shortcutId } = this.props;

    if (shouldRefresh(data)) {
      fetchVideosFeed(shortcutId);
    }
  }

  openDetailsScreen(video) {
    const { feedUrl } = this.props;
    const { id } = video;

    navigateTo(ext('VideoDetails'), {
      id,
      feedUrl,
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

export const mapDispatchToProps = {
  find,
  next,
  fetchVideosFeed,
};

export default connect(mapStateToProps, mapDispatchToProps)(VideosList);
