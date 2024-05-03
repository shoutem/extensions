import { data } from 'context';
import _ from 'lodash';

export const IMAGES = 'shoutem.core.image-attachments';
export const VIDEOS = 'shoutem.core.video-attachments';
export const AUDIOS = 'shoutem.core.audio-attachments';
export const CATEGORIES = 'shoutem.core.categories';
export const CHANNELS = 'shoutem.core.channels';
export const IMPORTERS = 'shoutem.core.importers';
export const LANGUAGE_MODULE_STATUS = 'shoutem.core.language-module-status';
export const SCHEMAS = 'shoutem.core.schemas';
export const CURRENT_SCHEMA = _.get(data, ['params', 'schema']);
export const MODULES = 'shoutem.core.modules';
export const NOTIFICATIONS = 'shoutem.legacy.notifications';
