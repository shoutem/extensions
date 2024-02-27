import { requireEnvString } from '../../shared/env';

const apps = {
  endpoint: requireEnvString('SERVICES_APPS_URL'),
  apiToken: requireEnvString('SERVICES_API_TOKEN'),
};

export default apps;
