import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getExtensionSettings } from 'shoutem.application';
import { navigateTo } from 'shoutem.navigation';
import { RssListScreen } from 'shoutem.rss';
import { next, isBusy, isInitialized, shouldLoad } from '@shoutem/redux-io';
import { ListView, Spinner } from '@shoutem/ui';
import LargeYoutubeView from '../components/LargeYoutubeView';
import { ext } from '../const';
import { YOUTUBE_VIDEOS_SCHEMA, getVideosFeed, fetchFeed } from '../redux';

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
    const { feedUrl, navigateTo } = this.props;

    const route = {
      screen: ext('YoutubeVideoDetailsScreen'),
      props: {
        video,
        feedUrl,
      },
    };

    navigateTo(route);
  }

  refreshData(prevProps) {
    if (shouldLoad(this.props, prevProps, 'data')) {
      this.fetchData();
    }
  }

  fetchData() {
    const { fetchFeed, feedUrl, apiKey, sort } = this.props;

    if (_.isEmpty(feedUrl)) {
      return;
    }

    fetchFeed(feedUrl, apiKey, sort);
  }

  renderRow(video) {
    return <LargeYoutubeView video={video} onPress={this.openDetailsScreen} />;
  }

  renderData(data) {
    if (this.shouldRenderPlaceholderView(data)) {
      return this.renderPlaceholderView(data);
    }

    if (!isInitialized(data)) {
      return <Spinner styleName="xl-gutter-top" />;
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
  const sort = _.get(ownProps, 'shortcut.settings.sort');

  return {
    feedUrl,
    apiKey,
    sort,
    data: getVideosFeed(state, feedUrl),
  };
};

export const mapDispatchToProps = { navigateTo, fetchFeed, next };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(YoutubeVideosScreen);
