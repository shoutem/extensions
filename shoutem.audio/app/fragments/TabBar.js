import React from 'react';
import { TabBarRenderer } from 'shoutem.navigation';
import AudioBannerRenderer from './AudioBannerRenderer';

/**
 * Custom TabBar UI - with audio banner rendered above bottom tab navigator.
 */
const TabBar = props => {
  return (
    <>
      <AudioBannerRenderer />
      <TabBarRenderer.ReactNavigationBottomTabBar {...props} />
    </>
  );
};

export default TabBar;
