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

const { array, func, shape, string } = React.PropTypes;

/* eslint-disable  class-methods-use-this */

export default class ListScreen extends PureComponent {
  static propTypes = {
    // The shortcut title
    title: string,

    // Data items to display
    // eslint-disable-next-line  react/forbid-prop-types
    data: array,

    // Actions
    next: func.isRequired,
    style: shape({
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
    this.fetchData = this.fetchData.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentWillMount() {
    const { data } = this.props;

    if (shouldRefresh(data, true)) {
      this.fetchData();
    }
  }

  getNavigationBarProps() {
    const { title } = this.props;
    return {
      title: (title || '').toUpperCase(),
    };
  }

  getSectionId() {
    return null;
  }

  loadMore() {
    this.props.next(this.props.data);
  }

  fetchData() {

  }

  shouldRenderPlaceholderView(data) {
    if (!isInitialized(data) || isBusy(data)) {
      // Data is loading, treat it as valid for now
      return false;
    }

    // We want to render a placeholder in case of errors or if data is empty
    return isError(data) || !_.size(data);
  }

  renderPlaceholderView(data) {
    const { style } = this.props;

    const emptyStateViewProps = {
      icon: 'refresh',
      message: isError(data) ?
        'Unexpected error occurred.' :
        'Nothing here at this moment.',
      onRetry: this.fetchData,
      retryButtonTitle: 'TRY AGAIN',
    };

    return (
      <EmptyStateView
        {...emptyStateViewProps}
        style={style.emptyState}
      />
    );
  }

  renderSectionHeader() {
    return null;
  }

  // eslint-disable-next-line no-unused-vars
  renderRow(item) {
    // Override this function to render data items
    return null;
  }

  renderData(data) {
    if (this.shouldRenderPlaceholderView(data)) {
      return this.renderPlaceholderView(data);
    }

    return (
      <ListView
        data={data}
        getSectionId={this.getSectionId}
        renderRow={this.renderRow}
        loading={isBusy(data) || !isInitialized(data)}
        onRefresh={this.fetchData}
        onLoadMore={this.loadMore}
        renderSectionHeader={this.renderSectionHeader}
        style={this.props.style.list}
      />
    );
  }

  render() {
    const { data, style } = this.props;
    const navigationBarProps = this.getNavigationBarProps();

    return (
      <Screen style={style.screen}>
        <NavigationBar {...navigationBarProps} />
        {this.renderData(data)}
      </Screen>
    );
  }
}
