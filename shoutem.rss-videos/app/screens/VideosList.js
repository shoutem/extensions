import { connect } from 'react-redux';
import React from 'react';
import autoBind from 'auto-bind';
import _ from 'lodash';
import { find, next, shouldRefresh } from '@shoutem/redux-io';
import { navigateTo } from 'shoutem.navigation';
import { RssListScreen } from 'shoutem.rss';
import { getVideosFeed, fetchVideosFeed } from '../redux';
import { ext, RSS_VIDEOS_SCHEMA } from '../const';
import LargeVideoView from '../components/LargeVideoView';

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
    const { navigateTo, feedUrl } = this.props;
    const { id } = video;

    const route = {
      screen: ext('VideoDetails'),
      props: {
        id,
        feedUrl,
      },
    };

    navigateTo(route);
  }

  renderRow(video) {
    return <LargeVideoView video={video} onPress={this.openDetailsScreen} />;
  }
}

export const mapStateToProps = (state, ownProps) => {
  const shortcutId = _.get(ownProps, 'shortcut.id');
  const feedUrl = _.get(ownProps, 'shortcut.settings.feedUrl');
  const data = getVideosFeed(state, feedUrl);

  return {
    shortcutId,
    feedUrl,
    data,
  };
};

export const mapDispatchToProps = {
  navigateTo,
  find,
  next,
  fetchVideosFeed,
};

export default connect(mapStateToProps, mapDispatchToProps)(VideosList);
