import React from 'react';

import { EmptyStateView } from '@shoutem/ui';

const NO_SUBSCRIPTION_MESSAGE = 'This app is currently inactive. Please contact its developer for support!';

export default function SubscriptionMissingScreen() {
  return (
    <EmptyStateView icon="error" message={NO_SUBSCRIPTION_MESSAGE} styleName="wide-subtitle" />
  );
}

