import _ from 'lodash';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import { ext } from './const';
import { contactsApi } from './services';

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();

  const appId = getAppId();

  const { services } = getExtensionSettings(state, ext());

  const cloudUri = _.get(services, 'self.cloud');

  contactsApi.init(cloudUri, appId);
}
