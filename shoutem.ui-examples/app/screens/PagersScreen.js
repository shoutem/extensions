import React, { PureComponent } from 'react';

import { Screen, ScrollView } from '@shoutem/ui';
import { HorizontalPagers } from '@shoutem/ui/examples/components/HorizontalPagers';

import { NavigationBar } from 'shoutem.navigation';

export default class PagersScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <NavigationBar title="Pagers" />
        <ScrollView>
          <HorizontalPagers />
        </ScrollView>
      </Screen>
    );
  }
}
