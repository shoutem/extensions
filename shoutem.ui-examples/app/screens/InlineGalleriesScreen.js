import React, { PureComponent } from 'react';

import { Screen, ScrollView } from '@shoutem/ui';
import { InlineGalleries } from '@shoutem/ui/examples/components/InlineGalleries';

import { NavigationBar } from 'shoutem.navigation';

export default class InlineGalleriesScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <NavigationBar title="Inline Galleries" />
        <ScrollView>
          <InlineGalleries />
        </ScrollView>
      </Screen>
    );
  }
}
