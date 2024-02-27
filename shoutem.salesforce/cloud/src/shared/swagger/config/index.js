import { name, version } from '../../../../package.json';
import { requireEnvString } from '../../../../core/env';

export default {
  options: {
    swaggerDefinition: {
      openapi: '3.0.1',
      info: {
        title: `${name} Swagger API`,
        version,
      },
      host: requireEnvString('SWAGGER_BASE_URL', `localhost:${requireEnvString('NODE_PORT')}`),
      servers: [
        {
          url: requireEnvString('SWAGGER_BASE_URL', `localhost:${requireEnvString('NODE_PORT')}`),
        },
      ],
      components: {
        securitySchemes: {
          token: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      consumes: ['application/vnd.api+json'],
      produces: ['application/vnd.api+json'],
      schemes: ['http', 'https'],
      security: [
        {
          token: [],
        },
      ],
    },
    apis: ['./src/**/*.ts'],
  },
};
