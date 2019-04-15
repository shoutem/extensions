import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { Screen } from '@shoutem/ui';
import { EmptyStateView } from '@shoutem/ui-addons';
import { I18n } from 'shoutem.i18n';
import { NavigationBar } from '../components/ui';
import { ext } from '../const';

function NoScreens() {
  return (
    <Screen styleName="paper">
      <NavigationBar hidden />
      <EmptyStateView message={I18n.t(ext('noScreensMessage'))} />
    </Screen>
  );
}

export default connectStyle(ext('NoScreens'))(NoScreens);
