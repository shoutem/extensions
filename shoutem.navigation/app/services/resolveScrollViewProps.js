import { Device } from '@shoutem/ui';

import { IPHONE_X_HOME_INDICATOR_PADDING } from '../const';

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
    },
  };
}
