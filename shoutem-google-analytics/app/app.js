import { ext } from './const';
import { registerExtensionTrackers } from './helpers/registerExtensionTrackers';
import { configurationEvent } from 'shoutem.application';


export function appWillMount(app) {
  configurationEvent.addListener(() => registerExtensionTrackers(ext(), app));
}
