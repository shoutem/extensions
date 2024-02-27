import { requireEnvBoolean } from '../env';

export default {
  showFullError: requireEnvBoolean('ERROR_SHOW_FULL', false),
};
