import parseIntStrict from 'parse-int';
import { asyncParamMiddleware } from '../../shared/express';
import { errors, generateErrorCode } from '../../shared/error';
import monitorRepository from '../data/monitor-repository';
import { setMonitor } from '../service';
import Monitor from '../data/monitor-model';

const APP_ALIAS_REGEX = /app:(\w+)/;

export default function() {
  return asyncParamMiddleware(async (req, res, id) => {
    let monitor: Monitor;
    const aliasMatch = APP_ALIAS_REGEX.exec(id);
    if (aliasMatch && aliasMatch.length > 1) {
      monitor = await monitorRepository.findOne({ appId: aliasMatch[1] });
    } else {
      const dbId = parseIntStrict(id);
      monitor = dbId && (await monitorRepository.get(dbId));
    }
    if (!monitor) {
      throw new errors.NotFoundError('Monitor not found', generateErrorCode('monitor', 'notFound', 'monitorNotFound'));
    }

    setMonitor(req, monitor);
  });
}
