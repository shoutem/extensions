import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import {
  Device,
  Icon,
  NAVIGATION_HEADER_HEIGHT,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import MenuButton from './MenuButton';

export function Menu({ onDismissPress, onReloadPress, onClosePress, onScreenshotPress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClosePress}>
        <Icon name="close" style={styles.closeIcon} />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.textContainer}>
        <Text style={styles.title}>
          This is a preview of the mobile app screen
        </Text>
        <Text style={styles.subtitle}>
          You can change design and elements only within the Shoutem builder
          platform. This preview is here to help you visualize how your app will
          look like on mobile screen.
        </Text>
        <Text style={styles.subtitle}>
          To hide this message shake your device. If you want to go back to list
          of apps press button below
        </Text>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <MenuButton text="Screenshot the preview" onPress={onScreenshotPress} />
        <MenuButton text="Restart the preview" onPress={onReloadPress} />
        <MenuButton
          text="Go back to push notifications"
          onPress={onDismissPress}
          secondary
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFill,
    zIndex: 2,
    elevation: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 22,
  },
  closeIcon: {
    color: 'white',
    marginTop: Device.select({
      iPhoneX: NAVIGATION_HEADER_HEIGHT,
      iPhoneXR: NAVIGATION_HEADER_HEIGHT,
      default: 22,
    }),
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    color: 'white',
  },
  subtitle: {
    marginTop: 30,
    marginBottom: 9,
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  buttonContainer: {
    marginBottom: 22,
  },
});

Menu.propTypes = {
  onClosePress: PropTypes.func.isRequired,
  onDismissPress: PropTypes.func.isRequired,
  onReloadPress: PropTypes.func.isRequired,
  onScreenshotPress: PropTypes.func.isRequired,
};

export default React.memo(Menu);
