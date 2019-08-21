import { Device } from '@shoutem/ui';

import {
  IPHONE_X_HOME_INDICATOR_PADDING,
  NAVIGATION_HEADER_HEIGHT,
  IPHONE_X_NOTCH_PADDING,
  IPHONE_XR_NOTCH_PADDING,
  TAB_BAR_ITEM_HEIGHT,
} from '../const';

export default function resolveScrollViewProps(props) {
  const { style, isTabBar } = props;

  const homeIndicatorPadding = isTabBar ? 0 : IPHONE_X_HOME_INDICATOR_PADDING;
  const containerPadding = Device.select({
    iPhoneX: homeIndicatorPadding,
    iPhoneXR: homeIndicatorPadding,
    default: 0,
  });

  return {
    style: {
      ...style.scrollView,
    },
    contentContainerStyle: {
      paddingBottom: containerPadding,
    }
  };
}
