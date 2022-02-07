import React, { PureComponent } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import Pdf from 'react-native-pdf';
import WebView from 'react-native-webview';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView, Keyboard, Screen, View } from '@shoutem/ui';
import { currentLocation } from 'shoutem.cms';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import { AppContextProvider } from 'shoutem-core';
import NavigationToolbar from '../components/NavigationToolbar';
import { ext } from '../const';

function renderPlaceholderView() {
  return <EmptyStateView message={I18n.t(ext('noUrlErrorMessage'))} />;
}

const KEYBOARD_AVOIDING_ENABLED = Platform.OS === 'android';
const KEYBOARD_OFFSET = Keyboard.calculateKeyboardOffset();

export class WebViewScreen extends PureComponent {
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
    const { shortcut } = routeParams;

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

  resolveWebViewProps(appContext) {
    const {
      headers,
      forwardAuthHeader,
      requireGeolocationPermission,
      url,
      webViewProps,
    } = this.getSettings();

    const accessToken = _.get(appContext, ['shoutem.auth', 'accessToken']);
    const shouldInsertAuthHeader = accessToken && forwardAuthHeader;
    const defaultSource = _.isObject(url)
      ? {
          ...url,
          headers: {
            ...url.headers,
            ...(shouldInsertAuthHeader && {
              Authorization: `Bearer ${accessToken}`,
            }),
            ...headers,
          },
        }
      : {
          uri: url,
          headers: {
            ...(shouldInsertAuthHeader && {
              Authorization: `Bearer ${accessToken}`,
            }),
            ...headers,
          },
        };

    const defaultWebViewProps = {
      ref: this.setWebViewRef,
      startInLoadingState: true,
      onNavigationStateChange: this.onNavigationStateChange,
      source: defaultSource,
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
    const resolvedUrl = url?.uri || url;

    if (resolvedUrl.includes('.pdf')) {
      // TODO: Move to and then get from theme.
      const pdfStyle = { flex: 1, width: Dimensions.get('window').width };

      return <Pdf source={{ uri: url }} style={pdfStyle} />;
    }

    return (
      <AppContextProvider>
        {context => <WebView {...this.resolveWebViewProps(context)} />}
      </AppContextProvider>
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

WebViewScreen.propTypes = {
  currentLocation: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  checkPermissionStatus: PropTypes.func,
  headers: PropTypes.object,
};

WebViewScreen.defaultProps = {
  checkPermissionStatus: undefined,
  headers: {},
};

export default connectStyle(ext('WebViewScreen'))(
  currentLocation(WebViewScreen),
);
