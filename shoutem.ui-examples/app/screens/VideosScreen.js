import React, { PureComponent } from 'react';

import { Screen, ScrollView } from '@shoutem/ui';
import { Videos } from '@shoutem/ui/examples/components/Videos';

import { NavigationBar } from 'shoutem.navigation';

export default class VideosScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <NavigationBar title="Videos" />
        <ScrollView>
          <Videos />
        </ScrollView>
      </Screen>
    );
  }
}
