import React from 'react';

import { I18n } from 'shoutem.i18n';

import { EmptyStateView } from '@shoutem/ui';

import { ext } from '../const';

export default function SubscriptionMissingScreen() {
  return (
    <EmptyStateView icon="error" message={I18n.t(ext("noSubscriptionMessage"))} styleName="wide-subtitle" />
  );
}
