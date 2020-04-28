import React, { PureComponent } from 'react';

import { Screen, ScrollView } from '@shoutem/ui';
import { Dividers } from '@shoutem/ui/examples/components/Dividers';

import { NavigationBar } from 'shoutem.navigation';

export default class DividersScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <NavigationBar title="Dividers" />
        <ScrollView>
          <Dividers />
        </ScrollView>
      </Screen>
    );
  }
}
