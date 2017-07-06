import React, {
  PureComponent,
} from 'react';

import { InteractionManager } from 'react-native';

import { bindActionCreators } from 'redux';
import _ from 'lodash';

import {
  Screen,
  View,
  Spinner,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import {
  EmptyStateView,
} from '@shoutem/ui-addons';

import {
  find as findAction,
  isBusy,
  isInitialized,
  isError,

  shouldRefresh,
  getCollection,
} from '@shoutem/redux-io';

import { navigateTo } from '@shoutem/core/navigation';
import { openURL } from 'shoutem.web-view';

import { ext } from '../const';

/**
 * This is a base screen that contains all of the shared logic
 * required to render data required in About extension.
 * Screens that extend this screen will usually only implement the renderData method
 */
export class BaseAboutScreen extends PureComponent {
  static propTypes = {
    // The parent category that is used to display
    // the available categories in the drop down menu
    parentCategoryId: React.PropTypes.any,
    // Primary CMS data to display
    data: React.PropTypes.array.isRequired,
    // The shortcut title
    title: React.PropTypes.string.isRequired,
    // actions
    find: React.PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.fetchData = this.fetchData.bind(this);

    this.state = {
      schema: ext('About'),
    };
  }

  componentWillMount() {
    const { data } = this.props;
    if (shouldRefresh(data)) {
      this.fetchData();
    }
  }

  isCollectionValid(collection) {
    if ((!isInitialized(collection) && !isError(collection)) || isBusy(collection)) {
      // If collection is not initialized but has error it means initialization failed.
      // The collection is loading, treat it as valid for now
      return true;
    }

    // The collection is considered valid if it is not empty
    return !_.isEmpty(collection);
  }

  shouldRenderPlaceholderView() {
    const { parentCategoryId, data } = this.props;
    return _.isUndefined(parentCategoryId) || !this.isCollectionValid(data);
  }

  fetchData(schema) {
    const { find, parentCategoryId } = this.props;
    const { schema: defaultSchema } = this.state;

    if (!parentCategoryId) {
      return;
    }

    InteractionManager.runAfterInteractions(() =>
      find(schema || defaultSchema, undefined, {
        'filter[categories]': parentCategoryId,
      }),
    );
  }

  renderPlaceholderView() {
    const { data, parentCategoryId } = this.props;
    let emptyStateViewProps;

    if (_.isUndefined(parentCategoryId)) {
      // If collection doesn't exist (`parentCategoryId` is undefined), notify user to create
      // content and reload app, because `parentCategoryId` is retrieved through app configuration
      emptyStateViewProps = {
        icon: 'error',
        message: 'Please create content and reload your app.',
      };
    } else {
      emptyStateViewProps = {
        icon: 'refresh',
        message: (isError(data)) ?
                  'Unexpected error occurred.' : 'Nothing here at this moment.',
        onRetry: this.fetchData,
        retryButtonTitle: 'TRY AGAIN',
      };
    }

    return <EmptyStateView {...emptyStateViewProps} />;
  }

  renderLoadingSpinner() {
    return (
      <View styleName="xl-gutter-top">
        <Spinner styleName="lg-gutter-top" />
      </View>
    );
  }

  renderData(data) {
    // If no data is available, render placeholder view
    if (this.shouldRenderPlaceholderView()) {
      return this.renderPlaceholderView();
    }

    // If data is still loading, render loading spinner
    if (isBusy(data) || !isInitialized(data)) {
      return this.renderLoadingSpinner();
    }

    // If valid data is retrieved, take first input only
    // And finally, proceed with rendering actual About content
    const profile = _.first(data);
    return this.renderAboutInfo(profile);
  }

  render() {
    const { data } = this.props;

    return (
      <Screen styleName="full-screen paper">
        <NavigationBar {...this.getNavBarProps()} />
        {this.renderData(data)}
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const parentCategoryId = _.get(ownProps, 'shortcut.settings.parentCategory.id');
  const collection = state[ext()].allAbout;

  return {
    parentCategoryId,
    data: getCollection(collection[parentCategoryId], state),
  };
};

export const mapDispatchToProps = dispatch => (
  bindActionCreators(
    {
      navigateTo,
      openURL,
      find: findAction,
    },
    dispatch,
  )
);
