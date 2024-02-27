import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { getMeta } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView, Image, responsiveHeight } from '@shoutem/ui';
import { SearchInput } from 'shoutem.cms/components';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import {
  EpisodesListScreen,
  mapDispatchToProps,
  mapStateToProps,
} from './EpisodesListScreen';

const SEARCH_INPUT_ID = 'searchInput';

class EpisodesFeaturedImageListScreen extends EpisodesListScreen {
  constructor(props, context) {
    super(props, context);

    this.listRef = React.createRef();

    autoBindReact(this);
  }

  getListProps() {
    const { data, isSearchSettingEnabled } = this.props;

    const dataWithSearchItem = isSearchSettingEnabled
      ? [{ id: SEARCH_INPUT_ID }, ...data]
      : data;

    return {
      hasFeaturedItem: false,
      renderFeaturedItem: null,
      renderHeader: this.renderListHeader,
      stickyHeaderIndices: isSearchSettingEnabled ? [1] : undefined,
      data: dataWithSearchItem,
      ref: this.listRef,
    };
  }

  handleScrollToTop() {
    if (!this.listRef || !this.listRef?.current) {
      return;
    }

    this.listRef.current.scrollToIndex({
      index: 0,
      animated: true,
    });
  }

  handleSearchFocus() {
    if (!this.listRef || !this.listRef?.current) {
      return;
    }

    this.listRef.current.scrollToIndex({
      index: 1,
      animated: true,
      viewOffset: responsiveHeight(44),
    });
  }

  handleClearSearchText() {
    this.setState({ searchText: '' }, () => {
      this.fetchData();
      this.handleScrollToTop();
    });
  }

  renderHeader() {
    return null;
  }

  renderSearchInput() {
    const { searchText } = this.state;

    return (
      <SearchInput
        onChangeText={this.handleSearchTextChange}
        onClearPress={this.handleClearSearchText}
        input={searchText}
        onFocus={this.handleSearchFocus}
      />
    );
  }

  renderRow(episode) {
    if (episode.id === SEARCH_INPUT_ID) {
      return this.renderSearchInput();
    }

    return super.renderRow(episode);
  }

  renderListHeader() {
    const { data } = this.props;

    const meta = getMeta(data);

    return (
      <Image source={{ uri: meta?.imageUrl }} styleName="large placeholder" />
    );
  }

  renderPlaceholderView(data) {
    const { feedUrl, style } = this.props;

    if (_.isEmpty(feedUrl)) {
      // If feed doesn't exist (`feedUrl` is undefined), notify user to specify feed URL
      // and reload app, because `feedUrl` is retrieved through app configuration
      const emptyStateViewProps = {
        icon: 'error',
        message: I18n.t('shoutem.rss.noUrlMessage'),
        style: style?.emptyState,
      };

      return <EmptyStateView {...emptyStateViewProps} />;
    }

    const { searchEnabled, searchText } = this.state;

    const emptySearchResults = searchEnabled && !_.isEmpty(searchText);

    if (emptySearchResults) {
      return (
        <>
          {this.renderSearchInput()}
          <EmptyStateView
            icon="search"
            message={I18n.t('shoutem.rss.noSearchResultsText')}
            style={style?.emptyState}
          />
        </>
      );
    }

    return super.renderPlaceholderView(data);
  }
}

EpisodesFeaturedImageListScreen.propTypes = {
  ...EpisodesListScreen.propTypes,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  connectStyle(ext('EpisodesFeaturedImageListScreen'))(
    EpisodesFeaturedImageListScreen,
  ),
);
