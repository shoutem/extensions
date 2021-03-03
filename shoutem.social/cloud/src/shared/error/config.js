import { requireEnvBoolean } from '../../../core/env';

export default {
  showFullError: requireEnvBoolean('ERROR_SHOW_FULL', false),
};
