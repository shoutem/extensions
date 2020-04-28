import React, { PureComponent } from 'react';

import { Screen, ScrollView } from '@shoutem/ui';
import { FormComponents } from '@shoutem/ui/examples/components/FormComponents';

import { NavigationBar } from 'shoutem.navigation';

export default class FormsScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <NavigationBar title="Forms" />
        <ScrollView>
          <FormComponents />
        </ScrollView>
      </Screen>
    );
  }
}
