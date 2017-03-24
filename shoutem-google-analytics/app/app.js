import { ext } from './const';
import { registerExtensionTrackers } from './helpers/registerExtensionTrackers';

export function appDidMount(app) {
  registerExtensionTrackers(ext(), app);
}
