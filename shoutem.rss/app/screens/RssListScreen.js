import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { shouldRefresh } from '@shoutem/redux-io';
import { EmptyStateView } from '@shoutem/ui';
import { RemoteDataListScreen } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { loadFeed, loadNextFeedPage } from '../redux';

export class RssListScreen extends RemoteDataListScreen {
  static createMapDispatchToProps(actionCreators) {
    return dispatch =>
      bindActionCreators(
        {
          ...actionCreators,
          loadFeed,
          loadNextFeedPage,
        },
        dispatch,
      );
  }

  fetchData() {
    const { feedUrl, loadFeed, shortcutId } = this.props;
    const { schema, tag } = this.state;

    if (!feedUrl) {
      return;
    }

    loadFeed(schema, tag, shortcutId);
  }

  refreshData() {
    const { data } = this.props;

    if (shouldRefresh(data, true)) {
      this.fetchData();
    }
  }

  loadMore() {
    const { data: collection, loadNextFeedPage } = this.props;

    loadNextFeedPage(collection);
  }

  shouldRenderPlaceholderView(data) {
    const { feedUrl } = this.props;

    if (_.isUndefined(feedUrl)) {
      return true;
    }

    return super.shouldRenderPlaceholderView(data);
  }

  renderPlaceholderView(data) {
    const { feedUrl, style } = this.props;

    if (_.isUndefined(feedUrl)) {
      // If feed doesn't exist (`feedUrl` is undefined), notify user to specify feed URL
      // and reload app, because `feedUrl` is retrieved through app configuration
      const emptyStateViewProps = {
        icon: 'error',
        message: I18n.t(ext('noUrlMessage')),
        style: style?.emptyState,
      };

      return <EmptyStateView {...emptyStateViewProps} />;
    }

    return super.renderPlaceholderView(data);
  }
}

RssListScreen.propTypes = {
  ...RemoteDataListScreen.propTypes,
  find: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
  feedUrl: PropTypes.string,
  next: PropTypes.func,
};

RssListScreen.defaultProps = {
  ...RemoteDataListScreen.defaultProps,
  feedUrl: '',
  next: undefined,
};
