import { requireEnvString } from '../../../core/env';

export default {
  servicesAppBackend: requireEnvString('SERVICES_APP_BACKEND'),
  servicesAppBackendDebug: requireEnvString('SERVICES_APP_BACKEND_DEBUG'),
  servicesLegacyBackend: requireEnvString('SERVICES_LEGACY_BACKEND'),
  servicesApiToken: requireEnvString('SERVICES_API_TOKEN'),
};
