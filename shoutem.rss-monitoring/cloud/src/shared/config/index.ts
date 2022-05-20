import { requireEnvString } from '../../../core/env';

export default {
  servicesAppBackend: requireEnvString('SERVICES_APP_BACKEND'),
  servicesProxyBackend: requireEnvString('SERVICES_PROXY_BACKEND'),
  servicesLegacyBackend: requireEnvString('SERVICES_LEGACY_BACKEND'),
  servicesApiToken: requireEnvString('SERVICES_API_TOKEN'),
};
