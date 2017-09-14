import { shoutemUrls } from 'src/services';

export function getTwitterSettingsUrl(appId) {
  const query = { nid: appId };
  return shoutemUrls.buildHomepageUrl('/builder/settings/sharing/twitter', query);
}
