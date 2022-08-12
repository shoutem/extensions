import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { EmptyStateView, Screen } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

export default function SubscriptionMissingScreen({ navigation }) {
  // https://reactnavigation.org/docs/5.x/preventing-going-back/
  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      e.preventDefault();
    });
  });

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

SubscriptionMissingScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
