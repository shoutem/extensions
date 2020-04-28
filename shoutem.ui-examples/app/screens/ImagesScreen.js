import React, { PureComponent } from 'react';

import { Screen, ScrollView } from '@shoutem/ui';
import { Images } from '@shoutem/ui/examples/components/Images';

import { NavigationBar } from 'shoutem.navigation';

export default class ImagesScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <NavigationBar title="Images" />
        <ScrollView>
          <Images />
        </ScrollView>
      </Screen>
    );
  }
}
