import React, {
  Component,
} from 'react';

import { Screen } from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';
import { EmptyStateView } from '@shoutem/ui-addons';
import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';

import { ext } from '../const';

/**
 * Informs the user to enable a loyalty program for his application.
 */
class NoProgramScreen extends Component {
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
