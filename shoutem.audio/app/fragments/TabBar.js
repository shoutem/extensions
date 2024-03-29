import React from 'react';
import { TabBarRenderer } from 'shoutem.navigation';
import AudioBannerRenderer from './AudioBannerRenderer';

const TabBar = props => {
  return (
    <>
      <AudioBannerRenderer />
      <TabBarRenderer.ReactNavigationBottomTabBar {...props} />
    </>
  );
};

export default TabBar;
