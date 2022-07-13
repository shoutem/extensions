import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  isBusy,
  isError,
  isInitialized,
  shouldRefresh,
} from '@shoutem/redux-io';
import { EmptyStateView, ListView, Screen } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import { ext } from '../const';

/* eslint-disable  class-methods-use-this */

export default class RemoteDataListScreen extends PureComponent {
  static propTypes = {
    // The shortcut title
    title: PropTypes.string,

    // Data items to display
    // eslint-disable-next-line  react/forbid-prop-types
    data: PropTypes.array,

    // Actions
    next: PropTypes.func.isRequired,
    // Component style
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    this.refreshData();
  }

  componentDidUpdate(prevProps) {
    this.refreshData(prevProps);
  }

  refreshData() {
    const { data } = this.props;

    if (shouldRefresh(data, true)) {
      this.fetchData();
    }
  }

  getListProps() {
    return {};
  }

  // Override this function if you want custom sections
  getSectionId() {
    return null;
  }

  loadMore() {
    this.props.next(this.props.data);
  }

  /*
   * Override this function to implement specific data fetching.
   * It's empty since it's called to refresh data.
   */
  fetchData() {}

  shouldRenderPlaceholderView(data) {
    if ((!isInitialized(data) && !isError(data)) || isBusy(data)) {
      // Data is loading, treat it as valid for now
      return false;
    }

    // We want to render a placeholder in case of errors or if data is empty
    return isError(data) || !_.size(data);
  }

  renderPlaceholderView(data) {
    const { style = {} } = this.props;

    const emptyStateViewProps = {
      icon: 'refresh',
      message: isError(data)
        ? I18n.t(ext('unexpectedErrorMessage'))
        : I18n.t(ext('preview.noContentErrorMessage')),
      onRetry: this.fetchData,
      retryButtonTitle: I18n.t(ext('tryAgainButton')),
      style: style.emptyState,
    };

    return <EmptyStateView {...emptyStateViewProps} />;
  }

  // Override this function if you want custom section headers. Used with getSectionId.
  renderSectionHeader() {
    return null;
  }

  // Oveerride this function to render a featured item which differs from default renderRow.
  // eslint-disable-next-line no-unused-vars
  renderFeaturedItem(item) {
    return null;
  }

  // Override this function to render data items
  // eslint-disable-next-line no-unused-vars
  renderRow(item) {
    return null;
  }

  renderData(data) {
    if (this.shouldRenderPlaceholderView(data)) {
      return this.renderPlaceholderView(data);
    }

    const { style = {} } = this.props;
    const { screenSettings } = getRouteParams(this.props);
    const renderFeaturedItem = screenSettings.hasFeaturedItem
      ? this.renderFeaturedItem
      : null;

    return (
      <ListView
        data={data}
        getSectionId={this.getSectionId}
        renderRow={this.renderRow}
        loading={isBusy(data) || !isInitialized(data)}
        onRefresh={this.fetchData}
        onLoadMore={this.loadMore}
        renderSectionHeader={this.renderSectionHeader}
        hasFeaturedItem={screenSettings.hasFeaturedItem}
        renderFeaturedItem={renderFeaturedItem}
        style={style.list}
        initialListSize={1}
        {...this.getListProps()}
      />
    );
  }

  render() {
    const { data, style = {} } = this.props;

    return <Screen style={style.screen}>{this.renderData(data)}</Screen>;
  }
}
