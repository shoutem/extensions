import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { Screen, EmptyStateView } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

function NoScreens() {
  return (
    <Screen styleName="paper">
      <EmptyStateView message={I18n.t(ext('noScreensMessage'))} />
    </Screen>
  );
}

export default connectStyle(ext('NoScreens'))(NoScreens);
