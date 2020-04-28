import React, { PureComponent } from 'react';

import { Screen, ScrollView } from '@shoutem/ui';
import { DropDownMenus } from '@shoutem/ui/examples/components/DropDownMenus';

import { NavigationBar } from 'shoutem.navigation';

export default class DropDownMenusScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <NavigationBar title="Drop Down Menus" />
        <ScrollView>
          <DropDownMenus />
        </ScrollView>
      </Screen>
    );
  }
}
