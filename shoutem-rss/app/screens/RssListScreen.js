import React, { Component } from 'react';

import {
  Screen,
  ListView,
} from '@shoutem/ui';

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

import {
  EmptyStateView,
} from '@shoutem/ui-addons';

import {
  isBusy,
  isInitialized,
  isError,
  shouldRefresh,
} from '@shoutem/redux-io';

export class RssListScreen extends Component {
  static propTypes = {
    // The shortcut title
    title: React.PropTypes.string,
    // The url of the RSS feed to display
    feedUrl: React.PropTypes.string.isRequired,
    // RSS feed items to display
    feed: React.PropTypes.array,

    // Actions
    navigateTo: React.PropTypes.func,
    find: React.PropTypes.func,
    next: React.PropTypes.func,
    setNavBarProps: React.PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.fetchFeed = this.fetchFeed.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentWillMount() {
    const { feed } = this.props;

    if (shouldRefresh(feed, true)) {
      this.fetchFeed();
    }
  }

  fetchFeed() {
    const { feedUrl, find } = this.props;
    const { schema } = this.state;

    find(schema, undefined, {
      'filter[url]': feedUrl,
    });
  }

  loadMore() {
    this.props.next(this.props.feed);
  }

  shouldRenderPlaceholderView(feed) {
    if (!isInitialized(feed) || isBusy(feed)) {
      // The feed is loading, treat it as valid for now
      return false;
    }

    // We want to render a placeholder in case of errors, or
    // if the feed is empty
    return isError(feed) || !feed || (feed.length === 0);
  }

  // eslint-disable-next-line no-unused-vars
  renderRow(feedItem) {
    // Override this function to render feed items
    return null;
  }

  renderPlaceholderView(feed) {
    const message = isError(feed) ?
      'Unexpected error occurred.' : 'Nothing here at this moment.';

    return (
      <EmptyStateView
        icon="refresh"
        retryButtonTitle="TRY AGAIN"
        onRetry={this.fetchFeed}
        message={message}
      />
    );
  }

  renderFeed(feed) {
    if (this.shouldRenderPlaceholderView(feed)) {
      return this.renderPlaceholderView(feed);
    }

    return (
      <ListView
        data={feed}
        renderRow={this.renderRow}
        loading={isBusy(feed) || !isInitialized(feed)}
        onRefresh={this.fetchFeed}
        onLoadMore={this.loadMore}
      />
    );
  }

  render() {
    const { title, feed } = this.props;

    return (
      <Screen>
        <NavigationBar title={(title || '').toUpperCase()} />
        {this.renderFeed(feed)}
      </Screen>
    );
  }
}
