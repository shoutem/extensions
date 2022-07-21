import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { View } from '@shoutem/ui';
import { PreviewOverlay } from '../assets';

export function Watermark() {
  if (Platform.OS === 'android') {
    return null;
  }

  return (
    <View style={styles.overlayContainer} pointerEvents="box-none">
      <PreviewOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    zIndex: 1000,
    alignSelf: 'center',
  },
});

export default React.memo(Watermark);
