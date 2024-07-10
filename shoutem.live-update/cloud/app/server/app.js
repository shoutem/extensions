import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import rewrite from 'express-urlrewrite';
import { requireEnvBoolean } from '../../src/shared/env';
import { errorHandler, defaultNotFound, errorConfig } from '../../src/shared/error';
import swaggerSpec from '../../src/shared/swagger';
import { favicon } from '../../src/shared/express';
import '../../src/sequelize/models';
import { logger, logRequest } from '../../src/shared/logging';
import { passportAuthHandler } from '../../src/shared/auth';
import { router } from '../../src/router';
import {
  sequelizeUniqueConstraintErrorAdapter,
  sequelizeForeignConstraintErrorAdapter,
  sequelizeValidationErrorAdapter,
} from '../../src/shared/db';
import { ioErrorAdapter } from '../../src/shared/io';

const app = express();
app.disable('x-powered-by');
app.enable('trust proxy', true);

// Strip first part of the path which represents extension cannonical name
app.use(rewrite(/^\/[^\/]*\/*(.*)$/, '/$1'));

app.use(cors());
app.options('*', cors());

app.use(favicon());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const shouldLogRequests = requireEnvBoolean('LOG_API_REQUESTS', false);
if (shouldLogRequests) app.use(logRequest());

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(passportAuthHandler());

app.use('/', router);

app.use(defaultNotFound());

const errorHandlerOptions = {
  showFullError: errorConfig.showFullError,
  customAdapters: [
    sequelizeUniqueConstraintErrorAdapter,
    sequelizeForeignConstraintErrorAdapter,
    sequelizeValidationErrorAdapter,
    ioErrorAdapter,
  ],
};

app.use(errorHandler(errorHandlerOptions), (err, req, res, next) => {
  logger.error({ err, req });
  next();
});

export default app;
