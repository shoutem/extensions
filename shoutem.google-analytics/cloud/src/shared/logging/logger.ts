import bunyan from 'bunyan';
import loggingConfig from './config/logging';

const LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

const serializers = {
  err: bunyan.stdSerializers.err,
  req: bunyan.stdSerializers.req,
  res: bunyan.stdSerializers.res,
};

function getLogLevel(level) {
  const checkedLevel = level.toLowerCase();
  if (LOG_LEVELS.indexOf(checkedLevel) === -1) {
    throw new Error(`${level} is not a valid log level and should be one of ${LOG_LEVELS}`);
  }
  return checkedLevel;
}

const logger = bunyan.createLogger({
  name: 'node-seed-project',
  serializers,
  streams: [
    {
      level: getLogLevel(loggingConfig.logLevel),
      stream: process.stdout,
    },
  ],
});

export default logger;
