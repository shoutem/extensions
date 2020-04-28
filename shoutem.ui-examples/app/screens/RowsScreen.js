import React, { PureComponent } from 'react';

import { Screen, ScrollView } from '@shoutem/ui';
import { Rows } from '@shoutem/ui/examples/components/Rows';

import { NavigationBar } from 'shoutem.navigation';

export default class RowsScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <NavigationBar title="Rows" />
        <ScrollView>
          <Rows />
        </ScrollView>
      </Screen>
    );
  }
}
