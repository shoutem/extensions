import _ from 'lodash';
import { find } from '@shoutem/redux-io';
import { shoutemUrls } from '../../../services';

const JOURNEY_TRIGGERS = 'shoutem.campaign.journey-triggers';

export const SAVE_JOURNEY_TRIGGERS = 'SAVE_JOURNEY_TRIGGERS';

export function saveJourneyTriggers(payload) {
  return {
    type: SAVE_JOURNEY_TRIGGERS,
    payload,
  };
}

export function fetchTriggers(appId) {
  return async dispatch => {
    const triggerConfig = {
      schema: JOURNEY_TRIGGERS,
      request: {
        endpoint: shoutemUrls.appsApi(`v1/apps/${appId}/journey-triggers`),
        headers: {
          Accept: 'application/vnd.api+json',
        },
      },
    };

    try {
      const response = await dispatch(find(triggerConfig));
      const triggers = _.get(response, 'payload.data');
  
      return dispatch(saveJourneyTriggers(triggers));
    } catch(e) {
      console.error(e);
      throw e;
    }
  };
}

