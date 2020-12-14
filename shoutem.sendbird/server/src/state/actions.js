import { find } from '@shoutem/redux-io';
import _ from 'lodash';
import {
  SHOUTEM_MODULES,
  SHOUTEM_SUBSCRIPTIONS,
  SHOUTEM_PLANS,
} from '../const';
import { shoutemUrls } from '../services';
import { getChatModule } from './selectors';

const CHAT_MODULE = {
  data: {
    type: SHOUTEM_MODULES,
    attributes: {
      name: 'shoutem.sendbird',
    },
  },
};

export function loadAppSubscription(appId) {
  const config = {
    schema: SHOUTEM_SUBSCRIPTIONS,
    request: {
      endpoint: shoutemUrls.billingApi(
        `v1/accounts/me/subscriptions/application:${appId}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, 'subscription');
}

export function fetchAccountPlans() {
  const config = {
    schema: SHOUTEM_PLANS,
    request: {
      endpoint: shoutemUrls.billingApi(`v1/accounts/me/plans`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, 'subscription');
}

export function validateSubscriptionStatus(appId) {
  return dispatch => {
    return dispatch(loadAppSubscription(appId)).then(({ payload }) => {
      const hasValidSubscription =
        _.get(payload, 'data.attributes.status') === 'subscribed';
      const activePlanId = _.get(payload, 'data.relationships.plan.data.id');

      if (!hasValidSubscription) {
        return false;
      }

      return dispatch(fetchAccountPlans()).then(({ payload }) => {
        const plans = _.get(payload, 'data');
        const activePlan = _.find(plans, { id: activePlanId });
        const planFeatures = _.get(activePlan, 'relationships.features.data');
        const hasChatFeature = _.find(planFeatures, { id: 'shoutem.sendbird' });

        if (!hasChatFeature) {
          return false;
        }

        return true;
      });
    });
  };
}

export function loadAppModules(appId) {
  const config = {
    schema: SHOUTEM_MODULES,
    request: {
      endpoint: shoutemUrls.appsApi(`v1/apps/${appId}/modules`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, 'app');
}

export function activateChatModule(appId) {
  const config = {
    schema: SHOUTEM_MODULES,
    request: {
      method: 'POST',
      endpoint: shoutemUrls.appsApi(`v1/apps/${appId}/modules`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(CHAT_MODULE),
    },
  };

  return find(config, 'activate-module');
}

export function deactivateChatModule(appId) {
  return (dispatch, getState) => {
    const state = getState();
    const chatModule = getChatModule(state);

    const config = {
      schema: SHOUTEM_MODULES,
      request: {
        method: 'DELETE',
        endpoint: shoutemUrls.appsApi(`v1/apps/${appId}/modules/${chatModule.id}`),
        headers: { Accept: 'application/vnd.api+json' },
      },
    };

    return dispatch(find(config, 'activate-module'));
  }
}
