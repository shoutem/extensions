import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dimensions, Platform } from 'react-native';
import WebView from 'react-native-webview';
import Pdf from 'react-native-pdf';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { View, Screen, EmptyStateView } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { currentLocation } from 'shoutem.cms';
import { NavigationBar } from 'shoutem.navigation';
import NavigationToolbar from '../components/NavigationToolbar';
import { ext } from '../const';

function renderPlaceholderView() {
  return (
    <EmptyStateView message={I18n.t(ext('noUrlErrorMessage'))} />
  );
}

export class WebViewScreen extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    checkPermissionStatus: PropTypes.func,
    shortcut: PropTypes.shape({
      settings: PropTypes.shape({
        requireGeolocationPermission: PropTypes.bool,
        showNavigationToolbar: PropTypes.bool,
        url: PropTypes.string,
        title: PropTypes.string,
      }),
    }),
    // received via openURL, when other extensions open in-app browsers
    requireLocationPermission: PropTypes.bool,
    currentLocation: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      webNavigationState: {},
    };

    // Since WebView rerenders after every change, check for
    // permission is done in the constructor
    const { checkPermissionStatus, requireLocationPermission } = props;

    if (!_.isFunction(checkPermissionStatus)) {
      return;
    }

    const settingsPath = 'shortcut.settings.requireGeolocationPermission';
    const requirePermission = _.get(props, settingsPath, false) || requireLocationPermission;
    const isLocationAvailable = !!props.currentLocation;

    if (requirePermission && !isLocationAvailable) {
      checkPermissionStatus();
    }
  }

  onNavigationStateChange(webState) {
    this.setState({
      webNavigationState: webState,
    });
  }

  getSettings() {
    const { shortcut } = this.props;

    return shortcut ? shortcut.settings || {} : this.props;
  }

  setWebViewRef(ref) {
    this.webViewRef = ref;
  }

  getNavBarProps() {
    const { title } = this.props;

    return { title };
  }

  goForward() {
    this.webViewRef.goForward();
  }

  goBack() {
    this.webViewRef.goBack();
  }

  reload() {
    this.webViewRef.reload();
  }

  isNavigationEnabled() {
    const { showNavigationToolbar } = this.getSettings();
    const { webNavigationState } = this.state;

    const webNavigation = webNavigationState.canGoBack || webNavigationState.canGoForward;
    return showNavigationToolbar && webNavigation;
  }

  resolveWebViewProps() {
    const { url, requireGeolocationPermission } = this.getSettings();
    const defaultWebViewProps = {
      ref: this.setWebViewRef,
      startInLoadingState: true,
      onNavigationStateChange: this.onNavigationStateChange,
      source: { uri: url },
      scalesPageToFit: true,
      allowsInlineMediaPlayback: true,
      showsVerticalScrollIndicator: false,
    };

    if (Platform.OS === 'android') {
      return ({
        ...defaultWebViewProps,
        geolocationEnabled: requireGeolocationPermission,
      });
    }

    return defaultWebViewProps;
  }

  renderNavigationBar() {
    return (
      <NavigationBar {...this.getNavBarProps()} />
    );
  }

  renderWebView() {
    const { url } = this.getSettings();

    if (url.includes('.pdf')) {
      return (
        <Pdf
          source={{ uri: url }}
          style={{ flex: 1, width: Dimensions.get('window').width }}
        />
      );
    }

    return (
      <WebView
        {...this.resolveWebViewProps()}
      />
    );
  }

  renderWebNavigation() {
    const { webNavigationState } = this.state;

    if (!this.isNavigationEnabled()) {
      return null;
    }

    return (
      <NavigationToolbar
        goBack={this.goBack}
        goForward={this.goForward}
        reload={this.reload}
        webNavigationState={webNavigationState}
      />
    );
  }

  renderBrowser() {
    const webView = this.renderWebView();
    const webNavigationControls = this.renderWebNavigation();

    return (
      <View styleName="flexible">
        {webView}
        {webNavigationControls}
      </View>
    );
  }

  render() {
    const { url } = this.getSettings();

    if (!url) {
      return renderPlaceholderView();
    }

    return (
      <Screen>
        {this.renderNavigationBar()}
        {this.renderBrowser()}
      </Screen>
    );
  }
}

export default connect()(currentLocation(WebViewScreen));
