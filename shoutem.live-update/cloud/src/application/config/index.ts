import { requireEnvString } from '../../shared/env';

export default {
  endpoint: requireEnvString('SERVICES_APP_URL'),
};
