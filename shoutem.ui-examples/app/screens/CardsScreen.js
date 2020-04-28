import React, { PureComponent } from 'react';

import { Screen, ScrollView } from '@shoutem/ui';
import { Cards } from '@shoutem/ui/examples/components/Cards';

import { NavigationBar } from 'shoutem.navigation';

export default class CardsScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <NavigationBar title="Cards" />
        <ScrollView>
          <Cards />
        </ScrollView>
      </Screen>
    );
  }
}
