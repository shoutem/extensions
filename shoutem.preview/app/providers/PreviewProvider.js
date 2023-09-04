import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  LayoutAnimation,
  NativeModules,
  Platform,
  StyleSheet,
} from 'react-native';
import RNShake from 'react-native-shake';
import { captureScreen } from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Spinner, View } from '@shoutem/ui';
import { getAppId } from 'shoutem.application';
import { requestPermissions } from 'shoutem.permissions';
import { Menu, Tip, Watermark } from '../components';
import { clearPreviewStorage, GALLERY_PERMISSION } from '../services';

const { Mobilizer } = NativeModules;

export function PreviewProvider({ app, children }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const appId = getAppId();

  const [isLoading, setIsLoading] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isWatermarkVisible, setIsWatermarkVisible] = useState(true);
  const [isInitialTipVisible, setIsInitialTipVisible] = useState(true);
  const [triggerScreenshot, setTriggerScreenshot] = useState(false);

  useEffect(() => {
    requestPermissions(GALLERY_PERMISSION);
  }, []);

  const toggleOverlay = useCallback(() => {
    if (!isInitialTipVisible) {
      setIsOverlayVisible(prev => !prev);
      setIsWatermarkVisible(prev => !prev);
    }
  }, [isInitialTipVisible]);

  const handleScreenshotPress = useCallback(() => {
    setTriggerScreenshot(true);
    setIsOverlayVisible(false);
    setIsWatermarkVisible(false);
  }, []);

  const handleScreenshotFinished = useCallback(() => {
    fadeAnim.setValue(0);
    setIsWatermarkVisible(true);
    setTriggerScreenshot(false);
  }, [fadeAnim]);

  const hideVisibleOverlay = useCallback(() => {
    if (isInitialTipVisible) {
      handleTipClose();
    } else {
      toggleOverlay();
    }
  }, [isInitialTipVisible, handleTipClose, toggleOverlay]);

  useEffect(() => {
    const subscription = RNShake.addListener(hideVisibleOverlay);

    return () => subscription.remove();
  }, [hideVisibleOverlay]);

  useEffect(() => {
    if (triggerScreenshot && !isOverlayVisible && !isWatermarkVisible) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      Animated.timing(fadeAnim, {
        toValue: 100,
        duration: 800,
        useNativeDriver: true,
      }).start();

      captureScreen().then(
        uri => {
          CameraRoll.save(uri);
          handleScreenshotFinished();
        },
        () => {
          Alert.alert('Oops, screenshot failed');
          handleScreenshotFinished();
        },
      );
    }
  }, [
    fadeAnim,
    triggerScreenshot,
    isOverlayVisible,
    isWatermarkVisible,
    handleScreenshotFinished,
  ]);

  const handleTipClose = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsInitialTipVisible(false);
  }, []);

  // When closing preview from Disclose, unmount lifecycle is not called on iOS
  // It's added manually to properly execute all unmounting functions
  // eg. stopping TrackPlayer
  // Currently not needed on Android since everything executes properly
  const handleUnmount = useCallback(() => {
    if (Platform.OS === 'ios' && _.isFunction(app?.componentWillUnmount)) {
      app.componentWillUnmount();
    }
  }, [app]);

  const handleDismissPress = useCallback(() => {
    setIsLoading(true);

    clearPreviewStorage()
      .then(() => handleUnmount())
      .then(() => Mobilizer.dismissPreviewedApp())
      .finally(() => setIsLoading(false));
  }, [handleUnmount]);

  const handleReloadPress = useCallback(() => {
    setIsLoading(true);

    clearPreviewStorage()
      .then(() => handleUnmount())
      .then(() => Mobilizer.reloadPreviewedApp(appId))
      .finally(() => setIsLoading(false));
  }, [handleUnmount]);

  return (
    <View style={styles.container}>
      <Animated.View
        pointerEvents="box-none"
        style={{
          ...styles.screenshotAnimation,
          opacity: fadeAnim.interpolate({
            inputRange: [0, 30, 100],
            outputRange: [0, 100, 0],
          }),
        }}
      />
      {isWatermarkVisible && <Watermark />}
      {isOverlayVisible && (
        <Menu
          onDismissPress={handleDismissPress}
          onClosePress={toggleOverlay}
          onReloadPress={handleReloadPress}
          onScreenshotPress={handleScreenshotPress}
        />
      )}
      {isLoading && <Spinner isLoading={isLoading} style={styles.spinner} />}
      {isInitialTipVisible && <Tip onPress={handleTipClose} />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenshotAnimation: {
    flex: 1,
    zIndex: 2,
    elevation: 2,
    backgroundColor: 'white',
    ...StyleSheet.absoluteFill,
  },
  spinner: {
    zIndex: 2,
    elevation: 2,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    ...StyleSheet.absoluteFill,
  },
});

PreviewProvider.propTypes = {
  app: PropTypes.shape({
    componentWillUnmount: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default React.memo(PreviewProvider);
