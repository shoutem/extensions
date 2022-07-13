import _ from 'lodash';
import { createSelector } from 'reselect';
import { getExtension } from '@shoutem/redux-api-sdk';
import ext from '../../../const';
import { moduleName } from '../const';

function getNotificationJourneysState(state) {
  return state[ext()][moduleName];
}

function getExtensionData(state) {
  return getExtension(state, ext());
}

export const getJourneys = createSelector([getExtensionData], extension => {
  return extension.settings.journeys;
});

export const getTriggers = createSelector(
  [getNotificationJourneysState],
  state => state.triggers,
);

export const getAvailableTriggers = createSelector(
  [getJourneys, getTriggers, (_state, currentTriggerId) => currentTriggerId],
  (journeys, triggers, currentTriggerId) => {
    if (!journeys) {
      return triggers;
    }

    const usedTriggers = _.map(journeys, journey => journey.trigger.value);

    const availableTriggers = _.filter(
      triggers,
      trigger => !_.includes(usedTriggers, trigger.id),
    );

    if (!currentTriggerId) {
      return availableTriggers;
    }

    return [
      ...availableTriggers,
      _.find(triggers, trigger => trigger.id === currentTriggerId),
    ];
  },
);
