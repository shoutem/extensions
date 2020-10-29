import _ from 'lodash';
import { data } from 'context';

export const CATEGORIES = 'shoutem.core.categories';
export const CHANNELS = 'shoutem.core.channels';
export const SCHEMAS = 'shoutem.core.schemas';
export const CURRENT_SCHEMA = _.get(data, ['params', 'schema']);
