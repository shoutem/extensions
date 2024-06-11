import React, { PureComponent } from 'react';
import { LayoutAnimation, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  find,
  getCollection,
  isBusy,
  isError,
  isInitialized,
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
  ShareButton,
  SimpleHtml,
  Spinner,
  Title,
  View,
} from '@shoutem/ui';
import { executeShortcut } from 'shoutem.application';
import { I18n, selectors as i18nSelectors } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  getRouteParams,
  HeaderBackground,
  IconGrid,
  List,
  withChildrenRequired,
  withIsFocused,
} from 'shoutem.navigation';
import { ext, PAGE_SCHEMA } from '../const';

const navigationComponentsForLayoutTypes = {
  iconGrid: IconGrid,
  list: List,
};

export class PageScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    const shouldHideInitialHeader = this.isNavigationBarClear(props);

    props.navigation.setOptions({ headerShown: !shouldHideInitialHeader });

    this.pushedBarStyle = null;
    this.isScrolledDown = false;
  }

  componentDidMount() {
    const { navigation, data } = this.props;

    if (shouldRefresh(data)) {
      this.fetchData().then(() => {
        // Header title resolves as expected only if we set headerShown first, then calculate other options.
        navigation.setOptions({ headerShown: true });

        LayoutAnimation.easeInEaseOut();
        navigation.setOptions(this.getNavBarProps());
      });
    }
  }

  componentDidUpdate() {
    const { data, isFocused, navigation } = this.props;

    if (!!_.head(data)?.image && this.isNavigationBarClear()) {
      if (isFocused && !this.pushedBarStyle && !this.isScrolledDown) {
        this.pushedBarStyle = StatusBar.pushStackEntry({
          barStyle: 'light-content',
        });
      }

      if (!isFocused && this.pushedBarStyle) {
        StatusBar.popStackEntry(this.pushedBarStyle);
        this.pushedBarStyle = null;
      }
    }

    if (shouldRefresh(data)) {
      this.fetchData().then(() => {
        navigation.setOptions(this.getNavBarProps());
      });
    }
  }

  headerBackground() {
    const {
      navigationBarImage,
      backgroundImageEnabledFirstScreen,
      fitContainer,
      showTitle,
    } = this.props;

    return (
      <HeaderBackground
        settings={{
          backgroundImage: navigationBarImage,
          backgroundImageEnabledFirstScreen,
          fitContainer,
          showTitle,
        }}
        alwaysShow
      />
    );
  }

  fetchData(schema) {
    const { find, parentCategoryId, channelId } = this.props;

    if (!parentCategoryId) {
      return Promise.resolve();
    }

    return find(schema || PAGE_SCHEMA, undefined, {
      query: {
        'filter[categories]': parentCategoryId,
        'filter[channels]': channelId,
      },
    });
  }

  isNavigationBarClear(props = this.props) {
    const { screenSettings } = getRouteParams(props);

    return screenSettings.navigationBarStyle === 'clear';
  }

  resolveTitle() {
    const { data, showTitle } = this.props;

    if (!showTitle) {
      return '';
    }

    const isNavigationBarClear = this.isNavigationBarClear();

    if (isNavigationBarClear) {
      // If navigation bar is clear, show the name that is rendered below the image, so it looks like
      // it is transferred to the navigation bar when scrolling. Otherwise show the screen title
      // (from the shortcut). The screen title is always displayed on solid navigation bars.
      const profile = _.head(data);

      return profile.name;
    }

    // Using undefined when we want to show localized shortcut title - this way, we let HeaderTitle
    // component take care of localized title, because we don't get updated shortcut.title when app
    // locale changes.
    return undefined;
  }

  getNavBarProps() {
    const {
      backgroundImageEnabledFirstScreen,
      navigationBarImage,
    } = this.props;

    const title = this.resolveTitle();

    const shouldDisplayImage =
      backgroundImageEnabledFirstScreen && navigationBarImage;

    return {
      headerRight: this.headerRight,
      title,
      ...this.resolveNavigationStyles(),
      ...(shouldDisplayImage && { headerBackground: this.headerBackground }),
    };
  }

  resolveNavigationStyles() {
    const isNavigationBarClear = this.isNavigationBarClear();

    if (isNavigationBarClear) {
      const { data } = this.props;
      const profile = _.head(data);
      const hasImage = !!profile.image;

      return hasImage
        ? composeNavigationStyles(['clear', 'fade'])
        : composeNavigationStyles(['boxing']);
    }

    return {};
  }

  handleScroll(event) {
    const { data } = this.props;

    if (!_.head(data)?.image || !this.isNavigationBarClear()) {
      return;
    }

    // TODO: Dynamically support sizes via theme instead of hardcoded numbers.
    // We currently use 300 as this is the interpolation end-value for the
    // 'solidify' animation as defined in @shoutem/ui's theme.js.
    const targetYOffset = 300;
    const {
      nativeEvent: {
        contentOffset: { y: yOffset },
      },
    } = event;

    if (!this.pushedBarStyle && yOffset < targetYOffset) {
      this.pushedBarStyle = StatusBar.pushStackEntry({
        barStyle: 'light-content',
      });
      this.isScrolledDown = false;
    }

    if (this.pushedBarStyle && yOffset > targetYOffset) {
      StatusBar.popStackEntry(this.pushedBarStyle);
      this.pushedBarStyle = null;
      this.isScrolledDown = true;
    }
  }

  headerRight(props) {
    const { data, title } = this.props;

    const profile = _.head(data);
    const link = _.get(profile, 'web', '');

    if (!_.isEmpty(link)) {
      return (
        <ShareButton
          // eslint-disable-next-line react/prop-types
          iconProps={{ style: props.tintColor }}
          styleName="clear"
          title={title}
          url={link}
        />
      );
    }

    return null;
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
      <View
        styleName={`vertical xl-gutter-top ${bottomGutter} md-gutter-horizontal`}
      >
        <Title styleName="h-center md-gutter-bottom">
          {name.toUpperCase()}
        </Title>
        <Caption styleName="h-center">{subtitle}</Caption>
      </View>
    );
  }

  renderImage(profile) {
    const { screenSettings } = getRouteParams(this.props);

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
        styleName={screenSettings.imageSize || 'large'}
        source={{ uri: profile.image.url }}
        animationName="hero"
      />
    );
  }

  renderInfo(profile) {
    if (!_.get(profile, 'info')) {
      return null;
    }

    return <SimpleHtml body={profile.info} />;
  }

  renderNavigationOnly() {
    const {
      executeShortcut,
      navigationLayoutType,
      route,
      shortcut,
    } = this.props;

    const NavigationComponent =
      navigationComponentsForLayoutTypes[navigationLayoutType];
    const { screenSettings } = getRouteParams(this.props);
    const resolvedRoute = {
      ...route,
      params: {
        ...route.params,
        screenSettings: screenSettings[navigationLayoutType],
      },
    };

    return (
      <ScrollView
        onScroll={this.handleScroll}
        showsVerticalScrollIndicator={false}
      >
        <NavigationComponent
          executeShortcut={executeShortcut}
          shortcut={shortcut}
          route={resolvedRoute}
          styleName="paper"
        />
      </ScrollView>
    );
  }

  renderAboutInfo(profile) {
    const {
      executeShortcut,
      shortcut,
      navigationLayoutType,
      route,
    } = this.props;

    const hasNavigationItems = !_.isEmpty(shortcut.children);
    const NavigationComponent =
      navigationComponentsForLayoutTypes[navigationLayoutType];
    const { screenSettings } = getRouteParams(this.props);
    const resolvedRoute = {
      ...route,
      params: {
        ...route.params,
        screenSettings: screenSettings[navigationLayoutType],
      },
    };

    return (
      <ScrollView
        onScroll={this.handleScroll}
        showsVerticalScrollIndicator={false}
      >
        {this.renderImage(profile)}
        <View styleName="solid">
          {this.renderNameAndSubtitle(profile)}
          {this.renderInfo(profile)}
          {hasNavigationItems && (
            <>
              <Divider />
              <NavigationComponent
                executeShortcut={executeShortcut}
                shortcut={shortcut}
                route={resolvedRoute}
                styleName="paper"
              />
            </>
          )}
        </View>
      </ScrollView>
    );
  }

  isCollectionValid(collection) {
    if (
      (!isInitialized(collection) && !isError(collection)) ||
      isBusy(collection)
    ) {
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
        message: isError(data)
          ? I18n.t('shoutem.application.unexpectedErrorMessage')
          : I18n.t('shoutem.application.emptyCollectionErrorMessage'),
        onRetry: this.fetchData,
        retryButtonTitle: I18n.t('shoutem.application.tryAgainButton'),
      };
    }

    return (
      <EmptyStateView {...emptyStateViewProps} styleName="wide-subtitle" />
    );
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
    const profile = _.head(data);
    return this.renderAboutInfo(profile);
  }

  render() {
    const { data } = this.props;

    return <Screen styleName="paper">{this.renderData(data)}</Screen>;
  }
}

PageScreen.propTypes = {
  // Primary CMS data to display
  channelId: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  executeShortcut: PropTypes.func.isRequired,
  // actions
  find: PropTypes.func.isRequired,
  isFocused: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  // Settings
  navigationLayoutType: PropTypes.string.isRequired,
  // The parent category that is used to display
  // the available categories in the drop down menu
  parentCategoryId: PropTypes.string.isRequired,
  shortcut: PropTypes.object.isRequired,
  backgroundImageEnabledFirstScreen: PropTypes.bool,
  fitContainer: PropTypes.bool,
  navigationBarImage: PropTypes.string,
  route: PropTypes.object,
  showTitle: PropTypes.bool,
  title: PropTypes.string,
};

PageScreen.defaultProps = {
  fitContainer: false,
  backgroundImageEnabledFirstScreen: false,
  navigationBarImage: undefined,
  route: undefined,
  showTitle: false,
  title: '',
};

export function mapStateToProps(state, ownProps) {
  const routeParams = getRouteParams(ownProps);
  const { shortcut: modifiedShortcut } = ownProps;
  const { shortcut } = routeParams;
  const resolvedShortcut = modifiedShortcut || shortcut;
  const parentCategoryId = _.get(shortcut, 'settings.parentCategory.id');
  const navigationLayoutType = _.get(
    shortcut,
    'settings.navigationLayoutType',
    'iconGrid',
  );
  const collection = state[ext()].allPage;
  const channelId = i18nSelectors.getActiveChannelId(state);

  return {
    shortcut: resolvedShortcut,
    parentCategoryId,
    navigationLayoutType,
    data: getCollection(collection[parentCategoryId], state),
    channelId,
  };
}

export const mapDispatchToProps = { executeShortcut, find };

export default withIsFocused(
  withChildrenRequired(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(connectStyle(ext('PageScreen'))(PageScreen)),
  ),
);
