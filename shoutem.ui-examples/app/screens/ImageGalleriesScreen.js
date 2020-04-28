import React, { PureComponent } from 'react';

import { Screen, ScrollView } from '@shoutem/ui';
import { ImageGalleries } from '@shoutem/ui/examples/components/ImageGalleries';

import { NavigationBar } from 'shoutem.navigation';

export default class ImageGalleriesScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <NavigationBar title="Image Galleries" />
        <ScrollView>
          <ImageGalleries />
        </ScrollView>
      </Screen>
    );
  }
}
