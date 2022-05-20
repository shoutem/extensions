import { Dimensions, StatusBar } from 'react-native';
import {
  defaultThemeVariables,
  Device,
  IPHONE_X_HOME_INDICATOR_PADDING,
  IPHONE_X_NOTCH_PADDING,
  IPHONE_XR_NOTCH_PADDING,
  NAVIGATION_HEADER_HEIGHT,
} from '@shoutem/ui';
import pack from './package.json';

export const TAB_BAR_ITEM_HEIGHT = 60;

const window = Dimensions.get('window');

const NAVIGATION_BAR_HEIGHT = Device.select({
  iPhoneX: NAVIGATION_HEADER_HEIGHT + IPHONE_X_NOTCH_PADDING,
  iPhoneXR: NAVIGATION_HEADER_HEIGHT + IPHONE_XR_NOTCH_PADDING,
  notchedAndroid: NAVIGATION_HEADER_HEIGHT + StatusBar.currentHeight,
  default: NAVIGATION_HEADER_HEIGHT,
});

const TAB_BAR_HEIGHT = Device.select({
  iPhoneX: TAB_BAR_ITEM_HEIGHT + IPHONE_X_HOME_INDICATOR_PADDING,
  iPhoneXR: TAB_BAR_ITEM_HEIGHT + IPHONE_X_HOME_INDICATOR_PADDING,
  default: TAB_BAR_ITEM_HEIGHT,
});

export const THEMES_SCHEMA = 'shoutem.core.themes';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const commonThemeVariables = {
  // Reusable size properties
  sizes: {
    navBarHeight: NAVIGATION_BAR_HEIGHT,
    navHeaderHeight: NAVIGATION_HEADER_HEIGHT,
    tabBarHeight: TAB_BAR_HEIGHT,
    tabBarItemHeight: TAB_BAR_ITEM_HEIGHT,
    window,
    iphone: {
      X: {
        homeIndicatorPadding: IPHONE_X_HOME_INDICATOR_PADDING,
        notchPadding: IPHONE_X_NOTCH_PADDING,
      },
      XR: {
        notchPadding: IPHONE_XR_NOTCH_PADDING,
      },
    },
  },
  ...defaultThemeVariables,
};
