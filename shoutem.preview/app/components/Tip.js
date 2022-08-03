import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { calculateLineHeight, Text, View } from '@shoutem/ui';
import { PreviewTip } from '../assets';

export function Tip({ onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.overlayContainer}>
      <Text style={styles.title}>Shake the phone to show{'\n'}previewer controls</Text>
      <View style={styles.image}>
        <PreviewTip height={176} width={176} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
    elevation: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 22,
  },
  title: {
    fontSize: 25,
    lineHeight: calculateLineHeight(25),
    textAlign: 'center',
    color: 'white',
    marginTop: 220,
  },
  image: {
    alignSelf: 'center',
    marginTop: 60,
  },
});

Tip.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default React.memo(Tip);
