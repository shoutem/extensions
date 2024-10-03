import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@shoutem/ui';
import { isAndroid } from 'shoutem-core';
import { PreviewOverlay } from '../assets';

export function Watermark() {
  if (isAndroid) {
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
