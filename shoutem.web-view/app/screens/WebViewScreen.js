import React, { createRef, PureComponent } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import Pdf from 'react-native-pdf';
import WebView from 'react-native-webview';
import CookieManager from '@react-native-cookies/cookies';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView, Keyboard, Screen, View } from '@shoutem/ui';
import { currentLocation } from 'shoutem.cms';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import {
  PERMISSION_TYPES,
  requestPermissions,
  RESULTS,
} from 'shoutem.permissions';
import { AppContextProvider } from 'shoutem-core';
import NavigationToolbar from '../components/NavigationToolbar';
import { AUTH_EXTENSION, ext } from '../const';
import { parseUrl } from '../services';

const isAndroid = Platform.OS === 'android';
const KEYBOARD_OFFSET = Keyboard.calculateKeyboardOffset();

export class WebViewScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.webViewRef = createRef();

    this.state = {
      trackingGranted: isAndroid,
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

    if (!isAndroid) {
      const TRACKING_PERMISSION =
        PERMISSION_TYPES.IOS_APP_TRACKING_TRANSPARENCY;

      requestPermissions(TRACKING_PERMISSION).then(result => {
        if (result[TRACKING_PERMISSION] === RESULTS.GRANTED) {
          this.setState({ trackingGranted: true });
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { navigation } = this.props;

    const routeParams = getRouteParams(this.props);
    const prevRouteParams = getRouteParams(prevProps);

    if (prevRouteParams.title !== routeParams.title) {
      navigation.setOptions(this.getNavBarProps());
    }
  }

  onNavigationStateChange(webState) {
    this.setState({ webNavigationState: webState });

    if (isAndroid) {
      // As per Android dev docs:
      // flush() Ensures all cookies currently accessible through the getCookie
      // API are written to persistent storage.
      CookieManager.flush();
    }
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

  getNavBarProps() {
    const { title } = this.getSettings();

    return { title };
  }

  goForward() {
    this.webViewRef.current.goForward();
  }

  goBack() {
    this.webViewRef.current.goBack();
  }

  reload() {
    this.webViewRef.current.reload();
  }

  isNavigationEnabled() {
    const { showNavigationToolbar } = this.getSettings();
    const { webNavigationState } = this.state;

    const webNavigation =
      webNavigationState.canGoBack || webNavigationState.canGoForward;
    return showNavigationToolbar && webNavigation;
  }

  resolveWebViewProps(appContext) {
    const { trackingGranted } = this.state;

    const {
      headers,
      forwardAuthHeader,
      requireGeolocationPermission,
      url,
      webViewProps,
    } = this.getSettings();

    const accessToken = _.get(appContext, [AUTH_EXTENSION, 'accessToken']);
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
      ref: this.webViewRef,
      startInLoadingState: true,
      onNavigationStateChange: this.onNavigationStateChange,
      source: defaultSource,
      scalesPageToFit: true,
      allowsInlineMediaPlayback: true,
      showsVerticalScrollIndicator: false,
      sharedCookiesEnabled: trackingGranted,
      javaScriptCanOpenWindowsAutomatically: true,
      mixedContentMode: isAndroid ? 'compatibility' : 'never',
    };

    if (isAndroid) {
      return {
        ...defaultWebViewProps,
        ...webViewProps,
        geolocationEnabled: requireGeolocationPermission,
      };
    }

    return { ...defaultWebViewProps, ...webViewProps };
  }

  renderWebView(appContext) {
    const { style } = this.props;

    const { url } = this.getSettings();

    const ownUser = _.get(appContext, [AUTH_EXTENSION, 'user']);

    const resolvedUrl = parseUrl(url, ownUser);

    if (resolvedUrl.includes('.pdf')) {
      return (
        <Pdf
          source={{ uri: url }}
          style={style.pdfStyle}
          trustAllCerts={false}
        />
      );
    }

    return <WebView {...this.resolveWebViewProps(appContext)} />;
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
    return (
      <View styleName="flexible">
        <AppContextProvider>
          {context => this.renderWebView(context)}
        </AppContextProvider>
        {this.renderWebNavigation()}
      </View>
    );
  }

  render() {
    const { style } = this.props;

    const { url } = this.getSettings();

    if (!url) {
      return <EmptyStateView message={I18n.t(ext('noUrlErrorMessage'))} />;
    }

    return (
      <Screen>
        <KeyboardAvoidingView
          style={style.container}
          behavior="padding"
          keyboardVerticalOffset={KEYBOARD_OFFSET}
          enabled={isAndroid}
        >
          {this.renderBrowser()}
        </KeyboardAvoidingView>
      </Screen>
    );
  }
}

WebViewScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  checkPermissionStatus: PropTypes.func,
  currentLocation: PropTypes.object,
  headers: PropTypes.object,
};

WebViewScreen.defaultProps = {
  checkPermissionStatus: undefined,
  currentLocation: undefined,
  headers: {},
};

export default connectStyle(ext('WebViewScreen'))(
  currentLocation(WebViewScreen),
);
