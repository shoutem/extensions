import rio from '@shoutem/redux-io';
import { getAppId } from 'shoutem.application';

import reducer from './reducers';
import PhotosGrid from './screens/PhotosGrid';
import PhotosList from './screens/PhotosList';
import PhotoDetails from './screens/PhotoDetails';

export const screens = {
    PhotosGrid,
    PhotosList,
    PhotoDetails
};

export { reducer };

export const fallbackImage = require('./assets/image-fallback.png');

export function appDidMount(app) {
  const state = app.getState();
  const appId = getAppId();
  const proxyHost = 'http://api.dev.sauros.hr';

  // Configure the RSS photos schema in RIO
  const schema = 'shoutem.proxy.photos';
  rio.registerSchema({
    schema,
    request: {
      endpoint: `${proxyHost}/v1/apps/${appId}/proxy/resources/${schema}`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  });
}
