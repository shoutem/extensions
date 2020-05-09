import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dimensions, Platform } from 'react-native';
import WebView from 'react-native-webview';
import Pdf from 'react-native-pdf';
import _ from 'lodash';

import { View, Screen, Spinner, EmptyStateView } from '@shoutem/ui';

import { I18n } from 'shoutem.i18n';
import { currentLocation } from 'shoutem.cms';
import { NavigationBar } from 'shoutem.navigation';

import NavigationToolbar from '../components/NavigationToolbar';
import { ext } from '../const';

const { bool, shape, string } = PropTypes;

export class WebViewScreen extends PureComponent {
  static propTypes = {
    shortcut: shape({
      settings: shape({
        requireGeolocationPermission: bool,
        showNavigationToolbar: bool,
        url: string,
        title: string,
      }),
    }),
    // received via openURL, when other extensions open in-app browsers
    requireLocationPermission: bool,
  };

  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.reload = this.reload.bind(this);
    this.setWebViewRef = this.setWebViewRef.bind(this);
    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.renderNavigationBar = this.renderNavigationBar.bind(this);
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    this.resolveWebViewProps = this.resolveWebViewProps.bind(this);

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

  goBack() {
    this.webViewRef.goBack();
  }

  goForward() {
    this.webViewRef.goForward();
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

  getNavBarProps() {
    const { title } = this.props;

    return { title };
  }

  renderNavigationBar() {
    return (
      <NavigationBar {...this.getNavBarProps()} />
    );
  }

  renderLoadingSpinner() {
    return (
      <Screen
        style={{
          position: 'absolute',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <Spinner styleName="lg-gutter-top" />
      </Screen>
    );
  }

  resolveWebViewProps() {
    const { url, requireGeolocationPermission } = this.getSettings();
    const defaultWebViewProps = {
      ref: this.setWebViewRef,
      startInLoadingState: true,
      renderLoading: this.renderLoadingSpinner,
      onNavigationStateChange: this.onNavigationStateChange,
      source: { uri: url },
      scalesPageToFit: true,
    }

    if (Platform.OS === 'android') {
      return ({
        ...defaultWebViewProps,
        geolocationEnabled: requireGeolocationPermission,
      });
    }

    return defaultWebViewProps;
  }

  renderWebView() {
    const { url } = this.getSettings();

    if(url.includes(".pdf")) {
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
    if (!this.isNavigationEnabled()) {
      return null;
    }

    return (
      <NavigationToolbar
        webNavigationState={this.state.webNavigationState}
        goBack={this.goBack}
        goForward={this.goForward}
        reload={this.reload}
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

  renderPlaceholderView() {
    return (
      <EmptyStateView message={I18n.t(ext('noUrlErrorMessage'))} />
    );
  }

  render() {
    const { url } = this.getSettings();

    if (!url) {
      return this.renderPlaceholderView();
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
