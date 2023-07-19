import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import WebView from 'react-native-webview';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView, Keyboard, responsiveWidth } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import { NavigationToolbar } from '../components';
import { ext } from '../const';

const { width: windowWidth } = Dimensions.get('window');
const responsiveWindowWidth =
  windowWidth >= 430 ? windowWidth : responsiveWidth(windowWidth);

const KEYBOARD_OFFSET = Keyboard.calculateKeyboardOffset();
const isAndroid = Platform.OS === 'android';

function BandsInTownScreen({
  shortcut: {
    settings: { widget },
  },
  style,
}) {
  const webViewRef = useRef();

  const [webViewWidth, setWebViewWidth] = useState(responsiveWindowWidth * 2);
  const [webNavigationState, setWebNavigationState] = useState({});

  // Yes, this is hacky. No, I couldn't find a better solution without forking
  // react-native-webview which is even worse. The issue is the use of static
  // HTML instead of an initial URL. Based off of medium article:
  // https://medium.com/@andrei.pfeiffer/reset-react-native-webview-to-initial-url-b57aad9442a0
  const [reseter, setReseter] = useState(0);
  function forceReset() {
    if (reseter) {
      setReseter(0);
      return;
    }

    setReseter(1);
  }

  function handleNavigationStateChange(webNavigationState) {
    setWebNavigationState(webNavigationState);

    // If we're back on the original static HTML source, use width adjustment.
    if (webNavigationState.url === 'about:blank') {
      setWebViewWidth(responsiveWindowWidth * 2);
    } else if (!webNavigationState.loading) {
      // We wait for loading to finish after navigating from static HTML because
      // otherwise we see it at original scale while the new site loads.
      setWebViewWidth(windowWidth);
    }
  }

  // Due to the black-box nature of the Bands in Town widget, we resort to these
  // width adjustmentents in order to display the mobile-friendly version of the
  // widget.
  const source = useMemo(
    () => ({
      html: `<div style="display:flex;">${widget}</div>`,
    }),
    [widget],
  );
  const webViewContainerStyle = useMemo(
    () => ({
      width: webViewWidth,
    }),
    [webViewWidth],
  );

  if (!widget) {
    return <EmptyStateView message={I18n.t(ext('noWidgetMessage'))} />;
  }

  return (
    <KeyboardAvoidingView
      style={style.container}
      behavior="padding"
      keyboardVerticalOffset={KEYBOARD_OFFSET}
      enabled={isAndroid}
    >
      <WebView
        ref={webViewRef}
        key={reseter}
        source={source}
        allowsInlineMediaPlayback
        containerStyle={webViewContainerStyle}
        javaScriptEnabled
        originWhiteList={['*']}
        setSupportMultipleWindows={false}
        showsVerticalScrollIndicator={false}
        startInLoadingState
        onNavigationStateChange={handleNavigationStateChange}
      />
      <NavigationToolbar
        goBack={webViewRef?.current?.goBack}
        goForward={webViewRef?.current?.goForward}
        reload={webViewRef?.current?.reload}
        reset={forceReset}
        webNavigationState={webNavigationState}
        webViewRef={webViewRef}
      />
    </KeyboardAvoidingView>
  );
}

BandsInTownScreen.propTypes = {
  shortcut: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
};

export function mapStateToProps(state, ownProps) {
  const { shortcut } = getRouteParams(ownProps);

  return { shortcut };
}

export default connect(mapStateToProps)(
  connectStyle(ext('BandsInTownScreen'))(BandsInTownScreen),
);
