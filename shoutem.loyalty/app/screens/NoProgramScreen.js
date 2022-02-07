import React, { PureComponent } from 'react';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView, Screen } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

/**
 * Informs the user to enable a loyalty program for his application.
 */
class NoProgramScreen extends PureComponent {
  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({ title: I18n.t(ext('noProgramNavBarTitle')) });
  }

  render() {
    return (
      <Screen styleName="full-screen paper">
        <EmptyStateView message={I18n.t(ext('noProgramErrorMessage'))} />
      </Screen>
    );
  }
}

export default connectStyle(ext('NoProgramScreen'))(NoProgramScreen);
