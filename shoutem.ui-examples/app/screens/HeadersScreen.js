import React, { PureComponent } from 'react';

import { Screen, ScrollView } from '@shoutem/ui';
import { Headers } from '@shoutem/ui/examples/components/Headers';

import { NavigationBar } from 'shoutem.navigation';

export default class HeadersScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <NavigationBar title="Buttons" />
        <ScrollView>
          <Headers />
        </ScrollView>
      </Screen>
    );
  }
}
