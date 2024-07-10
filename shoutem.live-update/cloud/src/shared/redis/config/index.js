import { requireEnvNumber, requireEnvString } from '../../env';

export default {
  prefix: requireEnvString('REDIS_CACHE_PREFIX', 'shoutem.live-update'),
  ttl: requireEnvNumber('CACHE_TIME_TO_LIVE', 30 * 60),
};
