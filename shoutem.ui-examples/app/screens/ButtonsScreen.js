import React, { PureComponent } from 'react';

import { Screen, ScrollView } from '@shoutem/ui';
import { Buttons } from '@shoutem/ui/examples/components/Buttons';

import { NavigationBar } from 'shoutem.navigation';

export default class ButtonsScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <NavigationBar title="Buttons" />
        <ScrollView>
          <Buttons />
        </ScrollView>
      </Screen>
    );
  }
}
