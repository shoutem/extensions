import React, { PureComponent } from 'react';
import { I18n } from 'shoutem.i18n';
import { connectStyle } from '@shoutem/theme';
import { Subtitle, Title, View } from '@shoutem/ui';
import { ext } from '../const';

export class SearchInstructions extends PureComponent {
  render() {
    return (
      <View styleName="vertical h-center v-center xl-gutter-bottom">
        <Title styleName="bold md-gutter-bottom md-gutter-horizontal">
          {I18n.t(ext('searchInstructions'))}
        </Title>
        <Subtitle styleName="md-gutter-horizontal">
          {I18n.t(ext('searchExplanation'))}
        </Subtitle>
      </View>
    );
  }
}

export default connectStyle(ext('SearchInstructions'))(SearchInstructions);
