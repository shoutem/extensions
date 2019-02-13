import { Device } from '@shoutem/ui'

import {
  IPHONE_X_HOME_INDICATOR_PADDING,
  NAVIGATION_HEADER_HEIGHT,
  IPHONE_X_NOTCH_PADDING,
  TAB_BAR_ITEM_HEIGHT,
} from '../const';

export default function resolveScrollViewProps(props) {
  const { navigationBarImage, style, isTabBar } = props;

  const homeIndicatorPadding = isTabBar ? 0 : IPHONE_X_HOME_INDICATOR_PADDING;
  const navBarPadding = Device.select({
    iPhoneX: navigationBarImage ? (NAVIGATION_HEADER_HEIGHT + IPHONE_X_NOTCH_PADDING) : 0,
    default: navigationBarImage ? NAVIGATION_HEADER_HEIGHT : 0,
  });
  const containerPadding = Device.select({
    iPhoneX: homeIndicatorPadding,
    default: 0,
  });

  return {
    style: {
      ...style.scrollView,
    },
    contentContainerStyle: {
      paddingTop: navBarPadding,
      paddingBottom: containerPadding,
    }
  };
}
