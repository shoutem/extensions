import React, { PureComponent } from 'react';

import { Screen, ScrollView } from '@shoutem/ui';
import { Spinners } from '@shoutem/ui/examples/components/Spinners';

import { NavigationBar } from 'shoutem.navigation';

export default class SpinnersScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <NavigationBar title="Spinners" />
        <ScrollView>
          <Spinners />
        </ScrollView>
      </Screen>
    );
  }
}
