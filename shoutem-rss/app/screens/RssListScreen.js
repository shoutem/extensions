import React, { PureComponent } from 'react';

import _ from 'lodash';

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

export class RssListScreen extends PureComponent {
  static propTypes = {
    // The shortcut title
    title: React.PropTypes.string,
    // The url of the RSS feed to display
    feedUrl: React.PropTypes.string,
    // RSS feed items to display
    feed: React.PropTypes.array,

    // Actions
    navigateTo: React.PropTypes.func,
    find: React.PropTypes.func,
    next: React.PropTypes.func,
    setNavBarProps: React.PropTypes.func,
    style: React.PropTypes.shape({
      screen: Screen.propTypes.style,
      list: ListView.propTypes.style,
      emptyState: EmptyStateView.propTypes.style,
    }),
  };

  static defaultProps = {
    style: {
      screen: {},
      list: {},
      emptyState: {},
    },
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

  getNavigationBarProps() {
    const { title } = this.props;
    return {
      title: (title || '').toUpperCase(),
    };
  }

  loadMore() {
    this.props.next(this.props.feed);
  }

  fetchFeed() {
    const { feedUrl, find } = this.props;
    const { schema } = this.state;

    if (!feedUrl) {
      return;
    }

    find(schema, undefined, {
      'filter[url]': feedUrl,
    });
  }

  shouldRenderPlaceholderView(feed) {
    const { feedUrl } = this.props;

    if (feedUrl && (!isInitialized(feed) || isBusy(feed))) {
      // The feed is loading, treat it as valid for now
      return false;
    }

    // We want to render a placeholder in case of errors, or
    // if the feed is empty
    return _.isUndefined(feedUrl) || isError(feed) || !feed || (feed.length === 0);
  }

  renderPlaceholderView(feed) {
    const { feedUrl, style } = this.props;
    let emptyStateViewProps;

    if (_.isUndefined(feedUrl)) {
      // If feed doesn't exist (`feedUrl` is undefined), notify user to specify feed URL
      // and reload app, because `feedUrl` is retrieved through app configuration
      emptyStateViewProps = {
        icon: 'error',
        message: 'Please specify RSS feed URL and reload your app.',
      };
    } else {
      emptyStateViewProps = {
        icon: 'refresh',
        message: isError(feed) ?
          'Unexpected error occurred.' :
          'Nothing here at this moment.',
        onRetry: this.fetchFeed,
        retryButtonTitle: 'TRY AGAIN',
      };
    }

    return (
      <EmptyStateView
        {...emptyStateViewProps}
        style={style.emptyState}
      />
    );
  }

  // eslint-disable-next-line no-unused-vars
  renderRow(feedItem) {
    // Override this function to render feed items
    return null;
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
        style={this.props.style.list}
      />
    );
  }

  render() {
    const { feed, style } = this.props;
    const navigationBarProps = this.getNavigationBarProps();

    return (
      <Screen style={style.screen}>
        <NavigationBar {...navigationBarProps} />
        {this.renderFeed(feed)}
      </Screen>
    );
  }
}
