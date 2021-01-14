import _ from 'lodash';
import { data } from 'context';

export const IMAGES = 'shoutem.core.image-attachments';
export const VIDEOS = 'shoutem.core.video-attachments';
export const CATEGORIES = 'shoutem.core.categories';
export const CHANNELS = 'shoutem.core.channels';
export const IMPORTERS = 'shoutem.core.importers';
export const LANGUAGE_MODULE_STATUS = 'shoutem.core.language-module-status';
export const SCHEMAS = 'shoutem.core.schemas';
export const CURRENT_SCHEMA = _.get(data, ['params', 'schema']);
