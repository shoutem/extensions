import React from 'react';
import { EmptyStateView, Screen } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

export default function UnavailableInWebScreen() {
  return (
    <Screen>
      <EmptyStateView
        icon="eye-crossed"
        message={I18n.t(ext('screenUnavailableInWebMessage'))}
        styleName="wide-subtitle"
      />
    </Screen>
  );
}
