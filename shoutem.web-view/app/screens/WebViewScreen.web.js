import React, { createRef, PureComponent } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import WebView from 'react-native-webview';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView, Keyboard, Screen, Toast, View } from '@shoutem/ui';
import { currentLocation } from 'shoutem.cms';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import {
  PERMISSION_TYPES,
  requestPermissions,
  RESULTS,
} from 'shoutem.permissions';
import { AppContextProvider, isAndroid } from 'shoutem-core';
import NavigationToolbar from '../components/NavigationToolbar';
import { AUTH_EXTENSION, ext } from '../const';
import { setWebViewResetCallback as setWebViewResetCallbackAction } from '../redux';

const KEYBOARD_OFFSET = Keyboard.calculateKeyboardOffset();

// TODO - remove all isAndroid logic, this is web...
// TODO - fix navigation toolbar, it's not shown now because there are no navigation
// state changes
export class WebViewScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    // showScreenTitle was implemented recently and default value is true.
    // We should only hide header title if app owner explicitly disabled the option
    // and republished the app.
    if (getRouteParams(props).shortcut.settings.showScreenTitle === false) {
      props.navigation.setOptions({
        headerTitle: '',
      });
    }

    this.webViewRef = createRef();

    this.state = {
      trackingGranted: isAndroid,
      webNavigationState: {},
      // React default key for component, used in state to be able to force WebView re-render.
      // Updating WebView's key to completely replace the component in DOM was the only way
      // to reset WebView's navigation state - otherwise it'd have previous history when we reset it
      // to initial URL.
      webViewKey: 1,
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
    const { navigation, setWebViewResetCallback } = this.props;
    const { shortcut } = getRouteParams(this.props);

    Toast.showInfo({
      title: 'Note',
      message:
        'Some web pages cannot be loaded in Web Preview. For better preview experience download Disclose app.',
    });

    navigation.setOptions(this.getNavBarProps());

    // Save the reset WebView function into redux state, so that it can be used
    // by middleware later. If this shortcut is active in bottom tabs nav and user
    // presses active tab item again - we'll reset Web View & it's state by
    // replacing whole component in DOM.
    setWebViewResetCallback(shortcut.id, () =>
      this.setState(prevState => ({ webViewKey: prevState.webViewKey + 1 })),
    );

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
    const { trackingGranted, webViewKey } = this.state;

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
      key: webViewKey,
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
  setWebViewResetCallback: PropTypes.func.isRequired,
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

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { setWebViewResetCallback: setWebViewResetCallbackAction },
    dispatch,
  );

export default connect(
  null,
  mapDispatchToProps,
)(connectStyle(ext('WebViewScreen'))(currentLocation(WebViewScreen)));
