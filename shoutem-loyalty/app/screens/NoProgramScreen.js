import React from 'react';

import { Screen } from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';
import { EmptyStateView } from '@shoutem/ui-addons';
import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';

/**
 * Informs the user to enable a loyalty program for his application.
 */
const NoProgramScreen = () => (
  <Screen styleName="full-screen paper">
    <NavigationBar title="LOYALTY" />
    <EmptyStateView message={'Turn on loyalty program in extension settings.'} />
  </Screen>
);

export default connectStyle(ext('NoProgramScreen'))(NoProgramScreen);
