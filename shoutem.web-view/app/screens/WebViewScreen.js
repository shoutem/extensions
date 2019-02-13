import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import Pdf from 'react-native-pdf';
import {
  WebView,
  InteractionManager,
  Dimensions,
  Platform,
} from 'react-native';

import { View, Screen, Spinner } from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';
import { EmptyStateView } from '@shoutem/ui-addons';
import { find } from '@shoutem/redux-io';

import { I18n } from 'shoutem.i18n';
import { currentLocation } from 'shoutem.cms';

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

    // componentWillReceiveProps() cannot be triggered due to
    // WebView re-rendering after every change, so there are no
    // actual prop changes:
    // https://stackoverflow.com/a/40330289/7920643
    const { checkPermissionStatus } = props;
    const { requireGeolocationPermission } = _.get(requireGeolocationPermission, 'props.shortcut.settings', [false]);
    const isLocationAvailable = !!props.currentLocation;

    if (requireGeolocationPermission && !isLocationAvailable && _.isFunction(checkPermissionStatus)) {
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
      <View styleName="xl-gutter-top">
        <Spinner styleName="lg-gutter-top" />
      </View>
    );
  }

  resolveWebViewProps(isAndroid) {
    const { url, requireGeolocationPermission } = this.getSettings();
    const defaultWebViewProps = {
      ref: this.setWebViewRef,
      startInLoadingState: true,
      renderLoading: this.renderLoadingSpinner,
      onNavigationStateChange: this.onNavigationStateChange,
      source: { uri: url },
      scalesPageToFit: true,
    }

    if (isAndroid) {
      return ({
        ...defaultWebViewProps,
        geolocationEnabled: requireGeolocationPermission,
      });
    }

    return defaultWebViewProps;
  }

  renderWebView() {
    const { url } = this.getSettings();
    const isAndroid = Platform.OS === 'android';

    if(url.includes(".pdf") && isAndroid) {
      return (
        <Pdf
          source={{ uri: url }}
          style={{ flex: 1, width: Dimensions.get('window').width }}
        />
      );
    }

    return (
      <WebView
        {...this.resolveWebViewProps(isAndroid)}
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
