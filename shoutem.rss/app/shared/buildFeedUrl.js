import { getAppId, getExtensionSettings } from 'shoutem.application';
import { ext } from '../const';

// Builds the RSS feed proxy URL for the given feed schema
export function buildFeedUrl(state, schema) {
  const appId = getAppId();
  const settings = getExtensionSettings(state, ext());

  const baseApiEndpoint = settings.baseApiEndpoint;
  if (!baseApiEndpoint) {
    console.error(`Base API endpoint not set in ${ext()} settings.`);
  }

  return `${baseApiEndpoint}/v1/apps/${appId}/proxy/resources/${schema}{?query*}`;
}
