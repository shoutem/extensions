import React from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { shouldRefresh } from '@shoutem/redux-io';
import { EmptyStateView, Screen } from '@shoutem/ui';
import { RemoteDataListScreen } from 'shoutem.application';
import { SearchInput } from 'shoutem.cms/components';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import { ext } from '../const';
import { loadFeed, loadNextFeedPage } from '../redux';

export class RssListScreen extends RemoteDataListScreen {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.debouncedFetchData = _.debounce(this.fetchData, 500);

    this.state = {
      searchEnabled: true,
      searchText: '',
    };
  }

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
    const { schema, tag, searchText } = this.state;

    if (!feedUrl) {
      return;
    }

    loadFeed(schema, tag, shortcutId, { searchText });
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

  handleSearchTextChange(searchText) {
    this.setState({ searchText }, () => this.debouncedFetchData());
  }

  handleClearSearchText() {
    this.setState({ searchText: '' }, () => this.fetchData());
  }

  shouldRenderPlaceholderView(data) {
    const { feedUrl } = this.props;

    if (_.isEmpty(feedUrl)) {
      return true;
    }

    return super.shouldRenderPlaceholderView(data);
  }

  renderPlaceholderView(data) {
    const { feedUrl, style } = this.props;

    if (_.isEmpty(feedUrl)) {
      // If feed doesn't exist (`feedUrl` is undefined), notify user to specify feed URL
      // and reload app, because `feedUrl` is retrieved through app configuration
      const emptyStateViewProps = {
        icon: 'error',
        message: I18n.t(ext('noUrlMessage')),
        style: style?.emptyState,
      };

      return <EmptyStateView {...emptyStateViewProps} />;
    }

    const { searchEnabled, searchText } = this.state;

    const emptySearchResults = searchEnabled && !_.isEmpty(searchText);

    if (emptySearchResults) {
      return (
        <EmptyStateView
          icon="search"
          message={I18n.t(ext('noSearchResultsText'))}
          style={style?.emptyState}
        />
      );
    }

    return super.renderPlaceholderView(data);
  }

  renderHeader() {
    const { shortcut } = getRouteParams(this.props);
    const { searchText } = this.state;

    const isSearchSettingEnabled = _.get(
      shortcut,
      'settings.isInAppContentSearchEnabled',
      false,
    );

    if (!isSearchSettingEnabled) {
      return null;
    }

    return (
      <SearchInput
        onChangeText={this.handleSearchTextChange}
        onClearPress={this.handleClearSearchText}
        input={searchText}
      />
    );
  }

  render() {
    const { data, style = {} } = this.props;

    return (
      <Screen style={style.screen}>
        {this.renderHeader()}
        {this.renderData(data)}
      </Screen>
    );
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
