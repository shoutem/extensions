import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { InteractionManager, LayoutAnimation, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { InlineMap } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  getRouteParams,
  navigateTo,
} from 'shoutem.navigation';
import { openURL } from 'shoutem.web-view';
import {
  find,
  isBusy,
  isInitialized,
  isError,
  shouldRefresh,
  getCollection,
} from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  Screen,
  Spinner,
  Title,
  Image,
  View,
  Divider,
  Caption,
  Subtitle,
  TouchableOpacity,
  ScrollView,
  SimpleHtml,
  EmptyStateView,
  ShareButton,
} from '@shoutem/ui';
import SocialButton from '../components/SocialButton';
import { ext } from '../const';

export class AboutScreen extends PureComponent {
  static propTypes = {
    // The parent category that is used to display
    // the available categories in the drop down menu
    parentCategoryId: PropTypes.any,
    // Primary CMS data to display
    data: PropTypes.array.isRequired,
    // actions
    find: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    const shouldHideInitialHeader = this.isNavigationBarClear(props);

    props.navigation.setOptions({ headerShown: !shouldHideInitialHeader });

    this.pushedBarStyle = null;

    this.state = {
      schema: ext('About'),
    };
  }

  componentDidMount() {
    const { data, navigation } = this.props;

    if (shouldRefresh(data)) {
      this.fetchData();
      return;
    }

    if (isInitialized(data)) {
      navigation.setOptions({
        ...this.getNavBarProps(),
        headerShown: true,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { navigation, data } = this.props;
    const { data: prevData } = prevProps;

    if (!isInitialized(prevData) && isInitialized(data)) {
      LayoutAnimation.easeInEaseOut();
      navigation.setOptions({ ...this.getNavBarProps(), headerShown: true });
    }
  }

  componentWillUnmount() {
    if (this.pushedBarStyle) {
      StatusBar.popStackEntry(this.pushedBarStyle);
    }
  }

  headerRight(props) {
    const { data } = this.props;
    const profile = _.first(data);

    if (_.isEmpty(profile?.web)) {
      return null;
    }

    return (
      <ShareButton
        styleName="clear"
        iconProps={{ style: props.tintColor }}
        title={_.get(profile, 'name')}
        url={_.get(profile, 'web')}
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
    const { data } = this.props;

    const profile = _.first(data);
    const hasImage = !!profile?.image;

    if (hasImage) {
      this.pushedBarStyle = StatusBar.pushStackEntry({
        barStyle: 'light-content',
      });
    }

    if (this.isNavigationBarClear()) {
      if (hasImage) {
        // If navigation bar is clear and image exists, navigation bar should be initially clear
        // with fade effect (to add shadow to image), but after scrolling down navigation bar
        // should appear (solidify animation)
        return {
          ...composeNavigationStyles(['clear', 'fade']),
          headerRight: this.headerRight,
        };
      }
      // If navigation bar is clear, but there is no image, navigation bar should be set to solid,
      // but boxing animation should be applied so that title and borders appear

      return {
        ...composeNavigationStyles(['boxing']),
        headerRight: this.headerRight,
      };
    }

    return {
      // If navigation bar is clear, show the name that is rendered below the image, so it looks like
      // it is transferred to the navigation bar when scrolling. Otherwise show the screen title
      // (from the shortcut). The screen title is always displayed on solid navigation bars.
      headerRight: this.headerRight,
    };
  }

  renderShare(profile) {}

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

    return <EmptyStateView {...emptyStateViewProps} />;
  }

  renderLoadingSpinner() {
    return (
      <View styleName="xl-gutter-top">
        <Spinner styleName="lg-gutter-top" />
      </View>
    );
  }

  renderImage(profile, styleName) {
    const extraSpace = profile?.image ? 'xl-gutter-top' : null;

    if (!_.get(profile, 'image')) {
      return (
        <View styleName={extraSpace}>
          <Divider />
        </View>
      );
    }

    return (
      <Image
        styleName={styleName || 'large'}
        source={{ uri: profile?.image.url }}
        animationName="hero"
      />
    );
  }

  renderTitle(profile) {
    if (!_.get(profile, 'name')) {
      return null;
    }

    const extraSpace = profile?.image ? null : 'lg-gutter-bottom';

    return (
      <View styleName={extraSpace}>
        <Title styleName="xl-gutter-top md-gutter-bottom h-center">
          {profile?.name.toUpperCase()}
        </Title>
      </View>
    );
  }

  renderInfo(profile) {
    if (!_.get(profile, 'info')) {
      return null;
    }

    return <SimpleHtml body={profile?.info} />;
  }

  renderMap(profile) {
    if (
      !_.get(profile, 'location.latitude') ||
      !_.get(profile, 'location.longitude')
    ) {
      return null;
    }

    const marker = {
      latitude: parseFloat(profile?.location.latitude),
      longitude: parseFloat(profile?.location.longitude),
      title: _.get(profile, 'location.formattedAddress'),
    };

    const region = {
      longitude: marker.longitude,
      latitude: marker.latitude,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    };

    const openMap = () =>
      navigateTo(ext('MapScreen'), {
        marker,
        title: profile?.name,
      });

    return (
      <View>
        <Divider styleName="section-header">
          <Caption>{I18n.t('shoutem.cms.mapTitle')}</Caption>
        </Divider>
        <TouchableOpacity onPress={openMap}>
          <InlineMap
            initialRegion={region}
            markers={[marker]}
            selectedMarker={marker}
            styleName="medium-tall"
          >
            <View styleName="overlay vertical v-center h-center fill-parent">
              <Subtitle>{profile?.name}</Subtitle>
              <Caption>{_.get(profile, 'location.formattedAddress')}</Caption>
            </View>
          </InlineMap>
        </TouchableOpacity>
      </View>
    );
  }

  renderOpeningHours(profile) {
    if (!_.get(profile, 'hours')) {
      return null;
    }

    return (
      <View styleName="vertical">
        <Divider styleName="section-header">
          <Caption>{I18n.t('shoutem.cms.openHours')}</Caption>
        </Divider>
        <SimpleHtml body={profile?.hours} />
        <Divider />
      </View>
    );
  }

  renderFooterButtons(profile) {
    if (!profile) {
      return null;
    }

    return (
      <View styleName="horizontal h-center">
        <View styleName="horizontal h-start wrap">
          <SocialButton
            icon="web"
            url={profile?.web}
            title={I18n.t('shoutem.cms.websiteButton')}
            openURL={openURL}
          />
          <SocialButton
            icon="call"
            url={profile?.phone && `tel:${profile?.phone}`}
            title={I18n.t('shoutem.cms.phoneButton')}
          />
          <SocialButton
            icon="tweet"
            url={profile?.twitter}
            title="Twitter"
            openURL={openURL}
          />
          <SocialButton
            icon="email"
            url={profile?.mail && `mailto:${profile?.mail}`}
            title={I18n.t('shoutem.cms.emailButton')}
          />
          <SocialButton
            icon="linkedin"
            url={profile?.linkedin}
            title="LinkedIn"
            openURL={openURL}
          />
          <SocialButton
            icon="facebook"
            url={profile?.facebook}
            title="Facebook"
            openURL={openURL}
          />
          <SocialButton
            icon="instagram"
            url={profile?.instagram}
            title="Instagram"
            openURL={openURL}
          />
        </View>
      </View>
    );
  }

  renderAboutInfo(profile) {
    const { imageSize } = this.props;

    return (
      <ScrollView>
        {this.renderImage(profile, imageSize)}
        <View styleName="solid">
          {this.renderTitle(profile)}
          {this.renderInfo(profile)}
          {this.renderMap(profile)}
          {this.renderOpeningHours(profile)}
          {this.renderFooterButtons(profile)}
          <Divider />
        </View>
      </ScrollView>
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

    return <Screen styleName="paper">{this.renderData(data)}</Screen>;
  }
}

const mapStateToProps = (state, ownProps) => {
  const parentCategoryId = _.get(
    ownProps,
    'route.params.shortcut.settings.parentCategory.id',
  );
  const { screenSettings } = getRouteParams(ownProps);
  const collection = state[ext()].allAbout;

  return {
    parentCategoryId,
    imageSize: screenSettings.imageSize,
    data: getCollection(collection[parentCategoryId], state),
  };
};

const mapDispatchToProps = { find };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('About'))(AboutScreen));
