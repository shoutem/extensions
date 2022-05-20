import React, { PureComponent } from 'react';
import { InteractionManager, LayoutAnimation, StatusBar } from 'react-native';
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
import { I18n } from 'shoutem.i18n';
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
    const {
      data,
      navigation,
      showTitle,
      shortcut,
      navigationBarImage,
      backgroundImageEnabledFirstScreen,
    } = this.props;

    if (shouldRefresh(data)) {
      return this.fetchData();
    }

    const shouldDisplayImage =
      backgroundImageEnabledFirstScreen && navigationBarImage;
    const title = showTitle ? _.get(shortcut, 'title', '') : '';

    if (!shouldDisplayImage) {
      return navigation.setOptions({
        ...this.getNavBarProps(),
        headerShown: true,
      });
    }

    return navigation.setOptions({
      ...this.getNavBarProps(),
      headerBackground: this.headerBackground,
      headerShown: true,
      title,
    });
  }

  componentDidUpdate(prevProps) {
    const { data: prevData } = prevProps;
    const {
      data,
      isFocused,
      navigation,
      navigationBarImage,
      backgroundImageEnabledFirstScreen,
    } = this.props;

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

    if (!isInitialized(prevData) && isInitialized(data)) {
      LayoutAnimation.easeInEaseOut();

      const shouldDisplayImage =
        backgroundImageEnabledFirstScreen && navigationBarImage;

      if (!shouldDisplayImage) {
        return navigation.setOptions({
          ...this.getNavBarProps(),
          headerShown: true,
        });
      }

      return navigation.setOptions({
        ...this.getNavBarProps(),
        headerBackground: this.headerBackground,
        headerShown: true,
      });
    }

    return null;
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
    const { find, parentCategoryId } = this.props;

    if (!parentCategoryId) {
      return;
    }

    InteractionManager.runAfterInteractions(() =>
      find(schema || PAGE_SCHEMA, undefined, {
        query: {
          'filter[categories]': parentCategoryId,
        },
      }),
    );
  }

  isNavigationBarClear(props = this.props) {
    const { screenSettings } = getRouteParams(props);

    return screenSettings.navigationBarStyle === 'clear';
  }

  getNavBarProps() {
    const {
      data,
      shortcut: { title = '' },
      showTitle,
    } = this.props;

    const resolvedTitle = showTitle ? title : '';

    if (!data || _.isEmpty(data)) {
      // Show shortcut title if `EmptyStateView` is rendered (no collection or empty collection)
      return { title: resolvedTitle };
    }

    if (this.isNavigationBarClear()) {
      const profile = _.head(data);
      const hasImage = !!profile.image;

      if (hasImage) {
        // If navigation bar is clear and image exists, navigation bar should be initially clear
        // with fade effect (to add shadow to image), but after scrolling down navigation bar
        // should appear (solidify animation)
        return {
          ...composeNavigationStyles(['clear', 'fade']),
          headerRight: this.headerRight,
          title: '',
        };
      }
      // If navigation bar is clear, but there is no image, navigation bar should be set to solid,
      // but boxing animation should be applied so that title and borders appear

      return {
        ...composeNavigationStyles(['boxing']),
        headerRight: this.headerRight,
        title: '',
      };
    }

    return {
      // If navigation bar is clear, show the name that is rendered below the image, so it looks like
      // it is transferred to the navigation bar when scrolling. Otherwise show the screen title
      // (from the shortcut). The screen title is always displayed on solid navigation bars.
      headerRight: this.headerRight,
      title: resolvedTitle,
    };
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
      <ScrollView onScroll={this.handleScroll}>
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
      <ScrollView onScroll={this.handleScroll}>
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

  return {
    shortcut: resolvedShortcut,
    parentCategoryId,
    navigationLayoutType,
    data: getCollection(collection[parentCategoryId], state),
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
