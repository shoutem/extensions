import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import WebView from 'react-native-webview';
import Pdf from 'react-native-pdf';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { View, EmptyStateView, Screen, Keyboard } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { I18n } from 'shoutem.i18n';
import { currentLocation } from 'shoutem.cms';
import { getRouteParams } from 'shoutem.navigation';
import NavigationToolbar from '../components/NavigationToolbar';
import { ext } from '../const';

function renderPlaceholderView() {
  return <EmptyStateView message={I18n.t(ext('noUrlErrorMessage'))} />;
}

const KEYBOARD_AVOIDING_ENABLED = Platform.OS === 'android';
const KEYBOARD_OFFSET = Keyboard.calculateKeyboardOffset();

export class WebViewScreen extends PureComponent {
  static propTypes = {
    checkPermissionStatus: PropTypes.func,
    route: PropTypes.object,
    currentLocation: PropTypes.object,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      webNavigationState: {},
    };

    // Since WebView rerenders after every change, check for
    // permission is done in the constructor
    const { checkPermissionStatus } = props;
    const { requireGeolocationPermission } = this.getSettings();

    if (!_.isFunction(checkPermissionStatus)) {
      return;
    }

    const isLocationAvailable = !!props.currentLocation;

    if (requireGeolocationPermission && !isLocationAvailable) {
      checkPermissionStatus();
    }
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());
  }

  onNavigationStateChange(webState) {
    this.setState({
      webNavigationState: webState,
    });
  }

  getSettings() {
    const { route } = this.props;
    const routeParams = getRouteParams(this.props);
    const shortcut = routeParams.shortcut;

    if (shortcut) {
      return { ...shortcut.settings, title: shortcut.title };
    }

    if (route) {
      return routeParams || {};
    }

    return {};
  }

  setWebViewRef(ref) {
    this.webViewRef = ref;
  }

  getNavBarProps() {
    const { title } = this.getSettings();

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

    const webNavigation =
      webNavigationState.canGoBack || webNavigationState.canGoForward;
    return showNavigationToolbar && webNavigation;
  }

  resolveWebViewProps() {
    const {
      url,
      requireGeolocationPermission,
      webViewProps,
    } = this.getSettings();

    const defaultWebViewProps = {
      ref: this.setWebViewRef,
      startInLoadingState: true,
      onNavigationStateChange: this.onNavigationStateChange,
      source: _.isObject(url) ? url : { uri: url },
      scalesPageToFit: true,
      allowsInlineMediaPlayback: true,
      showsVerticalScrollIndicator: false,
      javaScriptCanOpenWindowsAutomatically: true,
    };

    if (Platform.OS === 'android') {
      return {
        ...defaultWebViewProps,
        ...webViewProps,
        geolocationEnabled: requireGeolocationPermission,
      };
    }

    return { ...defaultWebViewProps, ...webViewProps };
  }

  renderWebView() {
    const { url } = this.getSettings();
    const resolvedUrl = _.isObject(url) ? url.uri : url;

    if (resolvedUrl.includes('.pdf')) {
      return (
        <Pdf
          source={{ uri: url }}
          style={{ flex: 1, width: Dimensions.get('window').width }}
        />
      );
    }

    return <WebView {...this.resolveWebViewProps()} />;
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
    const { style } = this.props;

    const { url } = this.getSettings();

    if (!url) {
      return renderPlaceholderView();
    }

    return (
      <Screen>
        <KeyboardAvoidingView
          style={style.container}
          behavior="padding"
          keyboardVerticalOffset={KEYBOARD_OFFSET}
          enabled={KEYBOARD_AVOIDING_ENABLED}
        >
          {this.renderBrowser()}
        </KeyboardAvoidingView>
      </Screen>
    );
  }
}

export default connect()(
  connectStyle(ext('WebViewScreen'))(currentLocation(WebViewScreen)),
);
