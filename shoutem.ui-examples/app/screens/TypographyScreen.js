import React, { PureComponent } from 'react';

import { Screen, ScrollView } from '@shoutem/ui';
import { Typography } from '@shoutem/ui/examples/components/Typography';

import { NavigationBar } from 'shoutem.navigation';

export default class TypographyScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <NavigationBar title="Typography" />
        <ScrollView>
          <Typography />
        </ScrollView>
      </Screen>
    );
  }
}
