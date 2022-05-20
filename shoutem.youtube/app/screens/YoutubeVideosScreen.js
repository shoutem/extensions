import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { isBusy, isInitialized, next, shouldLoad } from '@shoutem/redux-io';
import { ListView, Spinner } from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { RssListScreen } from 'shoutem.rss';
import LargeYoutubeView from '../components/LargeYoutubeView';
import { ext } from '../const';
import { fetchFeed, getVideosFeed, YOUTUBE_VIDEOS_SCHEMA } from '../redux';

export class YoutubeVideosScreen extends RssListScreen {
  constructor(props, context) {
    super(props, context);

    this.state = {
      ...this.state,
      schema: YOUTUBE_VIDEOS_SCHEMA,
    };

    autoBindReact(this);
  }

  openDetailsScreen(video) {
    const { feedUrl } = this.props;

    navigateTo(ext('YoutubeVideoDetailsScreen'), {
      video,
      feedUrl,
    });
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

  loadMore() {
    const { data: collection, next } = this.props;

    next(collection);
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

YoutubeVideosScreen.propTypes = {
  ...RssListScreen.propTypes,
  data: PropTypes.array,
  fetchFeed: PropTypes.func,
};

export const mapStateToProps = (state, ownProps) => {
  const routeParams = getRouteParams(ownProps);
  const feedUrl = _.get(routeParams, 'shortcut.settings.feedUrl');
  const sort = _.get(routeParams, 'shortcut.settings.sort');
  const { apiKey } = getExtensionSettings(state, ext());

  return {
    feedUrl,
    apiKey,
    sort,
    data: getVideosFeed(state, feedUrl),
  };
};

export const mapDispatchToProps = { fetchFeed, next };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(YoutubeVideosScreen);
