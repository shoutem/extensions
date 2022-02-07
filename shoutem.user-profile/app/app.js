import { registerIcons } from '@shoutem/ui';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import { UploadImage } from './form-builder/components/image-upload/assets';
import { ext } from './const';
import { setProfileSchema } from './redux';
import { resolveUserProfileSchema, shoutemApi } from './services';

export function appWillMount() {
  const iconConfigs = [{ name: 'upload-image', icon: UploadImage }];

  registerIcons(iconConfigs);
}

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();

  const {
    profileForm,
    services: {
      core: { apps: appsEndpoint, cms: legacyEndpoint },
    },
  } = getExtensionSettings(state, ext());

  const appId = getAppId();
  shoutemApi.init(appId, appsEndpoint, legacyEndpoint);

  const profileSchema = resolveUserProfileSchema(profileForm);
  store.dispatch(setProfileSchema(profileSchema));
}
