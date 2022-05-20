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
  isValid,
} from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { Image, Screen, ShareButton, SimpleHtml } from '@shoutem/ui';
import { I18n, selectors as i18nSelectors } from 'shoutem.i18n';
import { DetailsLayout } from 'shoutem.layouts';
import {
  composeNavigationStyles,
  getRouteParams,
  navigateTo,
  withIsFocused,
} from 'shoutem.navigation';
import { openURL } from 'shoutem.web-view';
import { FooterButtons, Map, OpeningHours } from '../components';
import { ext, schema } from '../const';

export class AboutScreen extends PureComponent {
  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    const shouldHideInitialHeader = this.isNavigationBarClear(props);

    props.navigation.setOptions({ headerShown: !shouldHideInitialHeader });

    this.pushedBarStyle = null;
    this.isScrolledDown = false;
  }

  componentDidMount() {
    const { navigation } = this.props;

    this.fetchData()
      .then(() => navigation.setOptions({ headerShown: true }))
      .then(() => {
        LayoutAnimation.easeInEaseOut();
        navigation.setOptions(this.getNavBarProps());
      });
  }

  componentDidUpdate(prevProps) {
    const { channelId, data, isFocused, navigation } = this.props;
    const { channelId: prevChannelId, data: prevData } = prevProps;

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

    if (prevChannelId !== channelId) {
      this.fetchData();
    }

    if (!isInitialized(prevData) && isInitialized(data)) {
      LayoutAnimation.easeInEaseOut();
      navigation.setOptions({ ...this.getNavBarProps(), headerShown: true });
    }
  }

  headerRight(props) {
    const { profile } = this.props;

    if (!profile.web) {
      return null;
    }

    return (
      <ShareButton
        styleName="clear"
        iconProps={{ style: props.tintColor }}
        title={profile.name}
        url={profile.web}
      />
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

  shouldRenderPlaceholderView() {
    const { parentCategoryId, data } = this.props;

    return !parentCategoryId || !this.isCollectionValid(data);
  }

  fetchData(forwardedSchema) {
    const { channelId, find, parentCategoryId } = this.props;

    if (!parentCategoryId) {
      return null;
    }

    return find(forwardedSchema || schema, undefined, {
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

  resolveNavigationStyles(isNavigationBarClear, hasImage) {
    if (isNavigationBarClear) {
      return hasImage
        ? composeNavigationStyles(['clear', 'fade'])
        : composeNavigationStyles(['boxing']);
    }

    return {};
  }

  getNavBarProps() {
    const { profile } = this.props;
    const {
      shortcut: { title },
    } = getRouteParams(this.props);

    const isNavigationBarClear = this.isNavigationBarClear();
    const hasImage = !!profile.image;
    // If navigation bar is clear, show the name that is rendered below the image, so it looks like
    // it is transferred to the navigation bar when scrolling. Otherwise show the screen title
    // (from the shortcut). The screen title is always displayed on solid navigation bars.
    const resolvedTitle = isNavigationBarClear
      ? profile.name?.toUpperCase() || title
      : title;

    return {
      headerRight: this.headerRight,
      title: resolvedTitle,
      ...this.resolveNavigationStyles(isNavigationBarClear, hasImage),
    };
  }

  resolveEmptyStateViewProps() {
    if (!this.shouldRenderPlaceholderView()) {
      return null;
    }

    const { data, parentCategoryId } = this.props;

    if (!parentCategoryId) {
      // If collection doesn't exist (`parentCategoryId` is undefined), notify user to create
      // content and reload app, because `parentCategoryId` is retrieved through app configuration
      return {
        icon: 'error',
        message: I18n.t('shoutem.application.preview.noContentErrorMessage'),
      };
    }

    return {
      icon: 'refresh',
      message: isError(data)
        ? I18n.t('shoutem.application.unexpectedErrorMessage')
        : I18n.t('shoutem.application.emptyCollectionErrorMessage'),
      onRetry: this.fetchData,
      retryButtonTitle: I18n.t('shoutem.application.tryAgainButton'),
    };
  }

  resolveMapProps() {
    const { profile } = this.props;

    if (!profile.location.latitude || !profile.location.longitude) {
      return null;
    }

    const marker = {
      latitude: parseFloat(profile.location.latitude),
      longitude: parseFloat(profile.location.longitude),
      title: profile.location.formattedAddress,
    };

    const region = {
      longitude: marker.longitude,
      latitude: marker.latitude,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    };

    function handleMapPress() {
      navigateTo(ext('MapScreen'), {
        marker,
        title: profile.name,
      });
    }

    return {
      caption: profile.location.formattedAddress,
      marker,
      onMapPress: handleMapPress,
      region,
      subtitle: profile.name,
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

  resolveFooterButtons(profile) {
    if (!profile) {
      return null;
    }

    const webButton = {
      icon: 'web',
      url: profile.web,
      title: I18n.t('shoutem.cms.websiteButton'),
      openURL,
    };

    const callButton = {
      icon: 'call',
      url: profile.phone ? `tel:${profile.phone}` : null,
      title: I18n.t('shoutem.cms.phoneButton'),
    };

    const tweetButton = {
      icon: 'tweet',
      url: profile.twitter,
      title: 'Twitter',
      openURL,
    };

    const emailButton = {
      icon: 'email',
      url: profile.mail ? `mailto:${profile.mail}` : null,
      title: I18n.t('shoutem.cms.emailButton'),
    };

    const linkedinButton = {
      icon: 'linkedin',
      url: profile.linkedin,
      title: 'LinkedIn',
      openURL,
    };

    const facebookButton = {
      icon: 'facebook',
      url: profile.facebook,
      title: 'Facebook',
      openURL,
    };

    const instagramButton = {
      icon: 'instagram',
      url: profile.instagram,
      title: 'Instagram',
      openURL,
    };

    return [
      webButton,
      callButton,
      tweetButton,
      emailButton,
      linkedinButton,
      facebookButton,
      instagramButton,
    ];
  }

  renderLeadImage() {
    const { imageSize, profile } = this.props;

    return (
      <Image
        styleName={imageSize}
        source={{ uri: profile.image?.url }}
        animationName="hero"
      />
    );
  }

  render() {
    const { data, profile } = this.props;

    const isLoading = isBusy(data) || !isInitialized(data) || !isValid(data);
    const detailsStyle = { screenStyleName: 'paper' };

    return (
      <Screen styleName="paper">
        <DetailsLayout
          isLoading={isLoading}
          emptyStateViewProps={this.resolveEmptyStateViewProps()}
          LeadImage={this.renderLeadImage}
          onScroll={this.handleScroll}
          style={detailsStyle}
          title={profile.name?.toUpperCase()}
        >
          <SimpleHtml body={profile.info} />
          {!_.isEmpty(profile.location) && (
            <Map {...this.resolveMapProps(profile)} />
          )}
          <OpeningHours htmlContent={profile.hours} />
          <FooterButtons buttons={this.resolveFooterButtons(profile)} />
        </DetailsLayout>
      </Screen>
    );
  }
}

AboutScreen.propTypes = {
  channelId: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  find: PropTypes.func.isRequired,
  isFocused: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  imageSize: PropTypes.string,
  parentCategoryId: PropTypes.string,
  profile: PropTypes.object,
};

AboutScreen.defaultProps = {
  imageSize: 'large',
  parentCategoryId: undefined,
  profile: {},
};

export function mapStateToProps(state, ownProps) {
  const channelId = i18nSelectors.getActiveChannelId(state);
  const parentCategoryId =
    ownProps.route.params.shortcut.settings.parentCategory?.id;
  const { screenSettings } = getRouteParams(ownProps);
  const collection = state[ext()].allAbout;
  const data = getCollection(collection[parentCategoryId], state);
  const profile = data[0];

  return {
    channelId,
    data,
    imageSize: screenSettings.imageSize,
    parentCategoryId,
    profile,
  };
}

export const mapDispatchToProps = { find };

export default withIsFocused(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('AboutScreen'))(AboutScreen)),
);
