import React from 'react';
import { View, Text } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

function HorizontalSeparator() {
  return (
    <View>
      <View />
      <Text>{I18n.t(ext('horizontalSeparatorText'))}</Text>
      <View />
    </View>
  );
}

export default connectStyle(ext('HorizontalSeparator'))(HorizontalSeparator);
