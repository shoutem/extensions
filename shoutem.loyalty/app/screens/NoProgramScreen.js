import React, { PureComponent } from 'react';

import { Screen, EmptyStateView } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';
import { NavigationBar } from 'shoutem.navigation';

import { ext } from '../const';

/**
 * Informs the user to enable a loyalty program for his application.
 */
class NoProgramScreen extends PureComponent {
  render() {
    return (
      <Screen styleName="full-screen paper">
        <NavigationBar title={I18n.t(ext('noProgramNavBarTitle'))} />
        <EmptyStateView message={I18n.t(ext('noProgramErrorMessage'))} />
      </Screen>
    );
  }
}

export default connectStyle(ext('NoProgramScreen'))(NoProgramScreen);
