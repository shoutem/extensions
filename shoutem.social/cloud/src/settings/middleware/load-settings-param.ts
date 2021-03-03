import parseIntStrict from 'parse-int';
import { asyncParamMiddleware } from '../../shared/express';
import { errors, generateErrorCode } from '../../shared/error';
import settingsRepository from '../data/settings-repository';
import { setSettings } from '../service';

export default function () {
  return asyncParamMiddleware(async (req, res, id) => {
    const dbId = parseIntStrict(id);
    const settings = dbId && await settingsRepository.get(dbId);

    if (!settings) {
      throw new errors.NotFoundError('Settings not found',
        generateErrorCode('settings', 'notFound', 'feedNotFound'));
    }

    setSettings(req, settings);
  });
}
