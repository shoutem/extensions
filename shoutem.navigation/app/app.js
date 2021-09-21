import React from 'react';
import { Image } from 'react-native';
import _ from 'lodash';
import { ScrollView } from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application/redux';
import { getAllShortcuts, getFirstShortcut } from 'shoutem.application';
import { ext } from './const';
import { RouteConfigProvider } from './providers';

export function render(app) {
  const screens = app.getScreens();
  const state = app.getState();
  const settings = getExtensionSettings(state, ext());
  const shortcuts = getAllShortcuts(state);
  const firstShortcut = getFirstShortcut(state);

  const hasNavBarImage = !_.isEmpty(settings.backgroundImage);

  if (hasNavBarImage) {
    Image.prefetch(settings.backgroundImage);
  }

  return (
    <ScrollView.DriverProvider>
      <RouteConfigProvider
        key="route_provider"
        screens={screens}
        shortcuts={shortcuts}
        firstShortcut={firstShortcut}
        navBarSettings={settings}
      />
    </ScrollView.DriverProvider>
  );
}
