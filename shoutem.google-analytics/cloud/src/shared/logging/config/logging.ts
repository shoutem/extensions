import { requireEnvString } from '../../env';

const DEFAULT_LOG_LEVEL = 'info';

export default {
  logLevel: requireEnvString('LOG_LEVEL', DEFAULT_LOG_LEVEL),
};
