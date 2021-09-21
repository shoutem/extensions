import React from 'react';

import { I18n } from 'shoutem.i18n';

import { EmptyStateView, Screen } from '@shoutem/ui';

import { ext } from '../const';

export default function SubscriptionMissingScreen() {
  return (
    <Screen>
      <EmptyStateView
        icon="error"
        message={I18n.t(ext('noSubscriptionMessage'))}
        styleName="wide-subtitle"
      />
    </Screen>
  );
}
