import React, { PureComponent } from 'react';
import { I18n } from 'shoutem.i18n';
import { connectStyle } from '@shoutem/theme';
import { Subtitle, Title, View } from '@shoutem/ui';
import { ext } from '../const';

export class GooglePlacesError extends PureComponent {
  render() {
    return (
      <View styleName="vertical h-center v-center xl-gutter-bottom">
        <Title styleName="h-center bold md-gutter-bottom md-gutter-horizontal">
          {I18n.t(ext('noGooglePlacesFound'))}
        </Title>
        <Subtitle styleName="h-center md-gutter-horizontal">
          {I18n.t(ext('googlePlacesErrorSuggestion'))}
        </Subtitle>
      </View>
    );
  }
}

export default connectStyle(ext('GooglePlacesError'))(GooglePlacesError);
