import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { isBusy, isInitialized, next } from '@shoutem/redux-io';
import { ListView, Spinner } from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { RssListScreen } from 'shoutem.rss';
import LargeYoutubeView from '../components/LargeYoutubeView';
import { ext } from '../const';
import { fetchFeed, getVideosFeed, YOUTUBE_VIDEOS_SCHEMA } from '../redux';
import { ERROR_TYPE, resolveYoutubeError } from '../services';

export class YoutubeVideosScreen extends RssListScreen {
  constructor(props, context) {
    super(props, context);

    this.state = {
      ...this.state,
      schema: YOUTUBE_VIDEOS_SCHEMA,
      apiPointsLimitReached: false,
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

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { apiKey, fetchFeed, feedUrl, sort } = this.props;

    if (_.isEmpty(feedUrl)) {
      return;
    }

    fetchFeed(feedUrl, apiKey, sort).catch(error => {
      const youtubeError = resolveYoutubeError(error);

      if (youtubeError) {
        // eslint-disable-next-line no-console
        console.warn(youtubeError.message);

        if (youtubeError.type === ERROR_TYPE.API_POINTS_LIMIT_REACHED) {
          this.setState({ apiPointsLimitReached: true });
        }
      }
    });
  }

  loadMore() {
    const { data: collection, next } = this.props;

    next(collection);
  }

  shouldRenderPlaceholderView(data) {
    const { apiPointsLimitReached } = this.state;

    if (apiPointsLimitReached) {
      return false;
    }

    return super.shouldRenderPlaceholderView(data);
  }

  // // Overriding it because we don't want to trigger fetch data on each componentDidUpdate
  // // if API points limit is reached. refreshData is always true in that case and it's a
  // // condition for fetchData to run again
  refreshData() {}

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
        loading={isBusy(data)}
        onRefresh={this.fetchData}
        onLoadMore={this.loadMore}
      />
    );
  }
}

YoutubeVideosScreen.propTypes = {
  ...RssListScreen.propTypes,
  fetchFeed: PropTypes.func.isRequired,
  data: PropTypes.array,
};

YoutubeVideosScreen.defaultProps = {
  data: [],
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

export const mapDispatchToProps = {
  fetchFeed,
  next,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(YoutubeVideosScreen);
