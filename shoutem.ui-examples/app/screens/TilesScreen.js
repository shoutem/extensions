import React, { PureComponent } from 'react';

import { Screen, ScrollView } from '@shoutem/ui';
import { Tiles } from '@shoutem/ui/examples/components/Tiles';

import { NavigationBar } from 'shoutem.navigation';

export default class TilesScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <NavigationBar title="Tiles" />
        <ScrollView>
          <Tiles />
        </ScrollView>
      </Screen>
    );
  }
}
