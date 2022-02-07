import _ from 'lodash';
import { contactsApi } from './services';
import { ext } from './const';
import { getAppId, getExtensionSettings } from 'shoutem.application';

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();

  const appId = getAppId();

  const { services } = getExtensionSettings(state, ext());

  const cloudUri = _.get(services, 'self.cloud');

  contactsApi.init(cloudUri, appId);
}
