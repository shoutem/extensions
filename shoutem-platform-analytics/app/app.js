import { registerExtensionTrackers } from 'shoutem.google-analytics';
import { ext } from './const';

export function appDidMount(app) {
  registerExtensionTrackers(ext(), app);
}
