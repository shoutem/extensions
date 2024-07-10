import { requireEnvString } from '../../env';

const auth = {
  endpoint: requireEnvString('SERVICES_AUTH_URL'),
};

export default auth;
