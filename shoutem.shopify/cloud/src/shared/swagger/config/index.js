import { requireEnvString } from '../../../../core/env';

export default {
  swaggerBaseUrl: requireEnvString('SWAGGER_BASE_URL', `localhost:${requireEnvString('NODE_PORT')}`),
};
