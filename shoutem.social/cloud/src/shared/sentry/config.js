import { requireEnvString } from '../../../core/env/index';

export default {
  dsn: requireEnvString('SENTRY_DSN', null),
  serviceName: requireEnvString('SENTRY_SERVICE_NAME', process.mainModule.filename),
};
