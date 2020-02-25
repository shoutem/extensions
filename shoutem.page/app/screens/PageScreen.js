import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { StatusBar, InteractionManager } from 'react-native';
import { connect } from 'react-redux';

import { executeShortcut } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { IconGrid, List, NavigationBar } from 'shoutem.navigation';
import { shortcutChildrenRequired } from 'shoutem.navigation/helpers';

import {
  getCollection,
  find,
  isBusy,
  isInitialized,
  isError,
  shouldRefresh,
} from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  EmptyStateView,
  Image,
  Screen,
  ScrollView,
  SimpleHtml,
  Spinner,
  Title,
  View,
} from '@shoutem/ui';

import { ext, PAGE_SCHEMA } from '../const';

const defaultImage = require('../assets/images/image-fallback.png');

const navigationComponentsForLayoutTypes = {
  iconGrid: IconGrid,
  list: List,
};

export class PageScreen extends PureComponent {
  static propTypes = {
    // The parent category that is used to display
    // the available categories in the drop down menu
    parentCategoryId: PropTypes.any,
    // Primary CMS data to display
    data: PropTypes.array.isRequired,
    // The shortcut title
    title: PropTypes.string.isRequired,
    // actions
    find: PropTypes.func.isRequired,
    // Settings
    navigationLayoutType: PropTypes.string.isRequired,
    navigationBarStyle: PropTypes.string.isRequired,
    imageSize: PropTypes.string.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.fetchData = this.fetchData.bind(this);
    this.renderAboutInfo = this.renderAboutInfo.bind(this);
    this.isNavigationBarClear = this.isNavigationBarClear.bind(this);
    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.renderImage = this.renderImage.bind(this);
  }

  componentDidMount() {
    const { data } = this.props;

    if (shouldRefresh(data)) {
      this.fetchData();
    }
  }

  fetchData(schema) {
    const { find, parentCategoryId } = this.props;

    if (!parentCategoryId) {
      return;
    }

    InteractionManager.runAfterInteractions(() => find(schema || PAGE_SCHEMA, undefined, {
      query: {
        'filter[categories]': parentCategoryId,
      },
    }));
  }

  isNavigationBarClear() {
    const { navigationBarStyle } = this.props;
    return navigationBarStyle === 'clear';
  }

  getNavBarProps() {
    const {
      data, title: shortcutTitle, parentCategoryId, navigationBarStyle,
    } = this.props;

    if (!_.isUndefined(parentCategoryId) && (isBusy(data) || !isInitialized(data))) {
      // Do not show shortcut title in NavigationBar if still loading
      return {};
    }

    if (!data || _.isEmpty(data)) {
      // Show shortcut title if `EmptyStateView` is rendered (no collection or empty collection)
      return {
        shortcutTitle,
      };
    }

    const profile = _.first(data);
    const hasImage = !!profile.image;

    if (hasImage) {
      StatusBar.setBarStyle('light-content');
    }

    let styleName = '';
    let animationName = '';
    if (this.isNavigationBarClear()) {
      if (hasImage) {
        // If navigation bar is clear and image exists, navigation bar should be initially clear
        // with fade effect (to add shadow to image), but after scrolling down navigation bar
        // should appear (solidify animation)
        styleName = 'fade clear';
        animationName = 'solidify';
      } else {
        // If navigation bar is clear, but there is no image, navigation bar should be set to solid,
        // but boxing animation should be applied so that title and borders appear
        animationName = 'boxing';
      }
    }

    const profileTitle = _.get(profile, 'name', '');
    const profileTitleUpper = profileTitle.toUpperCase();
    const link = _.get(profile, 'web');

    return {
      // If navigation bar is clear, show the name that is rendered below the image, so it looks like
      // it is transferred to the navigation bar when scrolling. Otherwise show the screen title
      // (from the shortcut). The screen title is always displayed on solid navigation bars.
      title: this.isNavigationBarClear() ? profileTitleUpper : shortcutTitle,
      share: _.isUndefined(link) ? null : { profileTitle, link },
      styleName,
      animationName,
    };
  }

  renderLoadingSpinner() {
    return (
      <View styleName="xl-gutter-top">
        <Spinner styleName="lg-gutter-top" />
      </View>
    );
  }


  renderNameAndSubtitle(profile) {
    const { image, name = '', subtitle } = profile;

    const bottomGutter = image ? 'lg-gutter-bottom' : 'xl-gutter-bottom';

    return (
      <View styleName={`vertical xl-gutter-top ${bottomGutter} md-gutter-horizontal`}>
        <Title styleName="h-center md-gutter-bottom">{name.toUpperCase()}</Title>
        <Caption styleName="h-center">{subtitle}</Caption>
      </View>
    );
  }

  renderImage(profile) {
    const { imageSize } = this.props;

    const extraSpace = profile.image ? 'xl-gutter-top' : null;

    if (!_.get(profile, 'image')) {
      return (
        <View styleName={extraSpace}>
          <Divider />
        </View>
      );
    }

    return (
      <Image
        styleName={imageSize || 'large'}
        source={{ uri: profile.image.url }}
        defaultSource={defaultImage}
        animationName="hero"
      />
    );
  }

  renderInfo(profile) {
    if (!_.get(profile, 'info')) {
      return null;
    }

    return (
      <SimpleHtml body={profile.info} />
    );
  }

  renderNavigationOnly() {
    const { executeShortcut, shortcut, navigationLayoutType } = this.props;

    const NavigationComponent = navigationComponentsForLayoutTypes[navigationLayoutType];
    const navigationSettings = this.props[navigationLayoutType];

    return (
      <ScrollView>
        <View styleName="solid">
          <NavigationComponent
            executeShortcut={executeShortcut}
            shortcut={shortcut}
            {...navigationSettings}
          />
        </View>
      </ScrollView>
    );
  }

  renderAboutInfo(profile) {
    const { executeShortcut, shortcut, navigationLayoutType } = this.props;

    const NavigationComponent = navigationComponentsForLayoutTypes[navigationLayoutType];
    const navigationSettings = this.props[navigationLayoutType];

    return (
      <ScrollView>
        {this.renderImage(profile)}
        <View styleName="solid">
          {this.renderNameAndSubtitle(profile)}
          {this.renderInfo(profile)}
          <Divider />
          <NavigationComponent
            executeShortcut={executeShortcut}
            shortcut={shortcut}
            {...navigationSettings}
          />
        </View>
      </ScrollView>
    );
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

  renderPlaceholderView() {
    const { data, parentCategoryId } = this.props;
    let emptyStateViewProps;

    if (_.isUndefined(parentCategoryId)) {
      // If collection doesn't exist (`parentCategoryId` is undefined), notify user to create
      // content and reload app, because `parentCategoryId` is retrieved through app configuration
      emptyStateViewProps = {
        icon: 'error',
        message: I18n.t('shoutem.application.preview.noContentErrorMessage'),
      };
    } else {
      emptyStateViewProps = {
        icon: 'refresh',
        message: (isError(data))
          ? I18n.t('shoutem.application.unexpectedErrorMessage')
          : I18n.t('shoutem.application.emptyCollectionErrorMessage'),
        onRetry: this.fetchData,
        retryButtonTitle: I18n.t('shoutem.application.tryAgainButton'),
      };
    }

    return <EmptyStateView {...emptyStateViewProps} styleName="wide-subtitle" />;
  }

  shouldRenderPlaceholderView() {
    const { parentCategoryId, data } = this.props;
    return _.isUndefined(parentCategoryId) || !this.isCollectionValid(data);
  }

  renderData(data) {
    const { shortcut } = this.props;
    const hasNavigationItems = !_.isEmpty(shortcut.children);

    // If no data is available, render placeholder view
    if (this.shouldRenderPlaceholderView()) {
      return hasNavigationItems
        ? this.renderNavigationOnly()
        : this.renderPlaceholderView();
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
    const { data, navigationBarStyle } = this.props;
    const fullScreen = this.isNavigationBarClear() ? 'full-screen' : '';

    return (
      <Screen styleName={`${fullScreen} paper`}>
        <NavigationBar {...this.getNavBarProps()} />
        {this.renderData(data)}
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const parentCategoryId = _.get(ownProps, 'shortcut.settings.parentCategory.id');
  const navigationLayoutType = _.get(ownProps, 'shortcut.settings.navigationLayoutType', 'iconGrid');
  const collection = state[ext()].allPage;

  return {
    parentCategoryId,
    navigationLayoutType,
    data: getCollection(collection[parentCategoryId], state),
  };
};

export const mapDispatchToProps = { executeShortcut, find };

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PageScreen'))(PageScreen),
);
