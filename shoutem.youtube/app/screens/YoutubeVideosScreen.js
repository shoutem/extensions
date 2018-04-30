import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import { ListView, Spinner } from '@shoutem/ui';
import {
  next,
  isBusy,
  isInitialized,
  shouldLoad,
} from '@shoutem/redux-io';
import { navigateTo } from '@shoutem/core/navigation';

import { getExtensionSettings } from 'shoutem.application';
import { RssListScreen } from 'shoutem.rss';

import { ext } from '../const';
import LargeYoutubeView from '../components/LargeYoutubeView';
import {
  YOUTUBE_VIDEOS_SCHEMA,
  getVideosFeed,
  fetchFeed,
 } from '../redux';

export class YoutubeVideosScreen extends RssListScreen {
  static propTypes = {
    ...RssListScreen.propTypes,
    fetchFeed: PropTypes.func,
    data: PropTypes.array,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      ...this.state,
      schema: YOUTUBE_VIDEOS_SCHEMA,
    };
    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderData = this.renderData.bind(this);
  }

  openDetailsScreen(video) {
    const { feedUrl } = this.props;

    const route = {
      screen: ext('YoutubeVideoDetailsScreen'),
      props: {
        video,
        feedUrl,
      },
    };
    this.props.navigateTo(route);
  }

  refreshData(nextProps) {
    if (shouldLoad(nextProps, this.props, 'data')) {
      this.fetchData();
    }
  }

  fetchData() {
    const { feedUrl, apiKey } = this.props;

    if (_.isEmpty(feedUrl)) {
      return;
    }

    this.props.fetchFeed(feedUrl, apiKey);
  }

  renderRow(video) {
    return (
      <LargeYoutubeView
        video={video}
        onPress={this.openDetailsScreen}
      />
    );
  }

  renderData(data) {
    if (this.shouldRenderPlaceholderView(data)) {
      return this.renderPlaceholderView(data);
    }

    if (!isInitialized(data)) {
      return (
        <Spinner styleName="xl-gutter-top" />
      );
    }

    return (
      <ListView
        data={data}
        renderRow={this.renderRow}
        loading={isBusy(data) || !isInitialized(data)}
        onRefresh={this.fetchData}
        onLoadMore={this.loadMore}
      />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const feedUrl = _.get(ownProps, 'shortcut.settings.feedUrl');
  const { apiKey } = getExtensionSettings(state, ext());

  return {
    feedUrl,
    apiKey,
    data: getVideosFeed(state, feedUrl),
  };
};

export const mapDispatchToProps = { navigateTo, fetchFeed, next };

export default connect(mapStateToProps, mapDispatchToProps)(YoutubeVideosScreen);
