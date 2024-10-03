import MCReactModule from 'react-native-marketingcloudsdk';
import _ from 'lodash';
import { getExtensionSettings } from 'shoutem.application/redux';
import { getUser, LOGIN, LOGOUT, REGISTER } from 'shoutem.auth';
import { before, priorities, setPriority } from 'shoutem-core';
import { ext } from '../const';
import { contactsApi } from '../services';

const SEARCH_RESPONSE_KEY =
  'channelAddressResponseEntities[0].contactKeyDetails[0].contactKey';

export const initMiddleware = setPriority(
  store => next => async action => {
    const actionType = _.get(action, 'type');

    if (actionType === LOGIN || actionType === REGISTER) {
      const state = store.getState();
      const user = getUser(state);
      const email = user?.username;
      const extensionSettings = getExtensionSettings(state, ext());
      const { salesforceAuthorized } = extensionSettings;

      if (!salesforceAuthorized || !email) {
        return next(action);
      }

      await contactsApi
        .searchContacts(email)
        .then(response => response.json())
        .then(responseJson => {
          const existingKey = _.get(responseJson, SEARCH_RESPONSE_KEY);
          if (existingKey) {
            MCReactModule.setContactKey(existingKey);
            MCReactModule.enablePush();
          } else {
            contactsApi
              .createContact(email)
              .then(response => response.json())
              .then(responseJson => {
                const contactKey = responseJson?.contactKey;

                if (contactKey) {
                  MCReactModule.setContactKey(contactKey);
                  MCReactModule.enablePush();
                }
              });
          }
        })
        // eslint-disable-next-line no-console
        .catch(e => console.log(e, e.message));

      return next(action);
    }

    return next(action);
  },
  priorities.AUTH,
);

export const logoutMiddleware = setPriority(
  // eslint-disable-next-line no-unused-vars
  _store => next => action => {
    if (action.type === LOGOUT) {
      MCReactModule.disablePush();
    }

    return next(action);
  },
  before(priorities.AUTH),
);
