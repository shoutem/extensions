import { asyncParamMiddleware } from '../../shared/express';
import { errors, generateErrorCode } from '../../shared/error';
import appRepository from '../data/app-repository';
import { setApp } from '../service';

export default function() {
  return asyncParamMiddleware(async (req, res, id) => {
    if (!id) {
      throw new errors.NotFoundError('App id missing', generateErrorCode('app', 'notFound', 'appIdMissing'));
    }

    let app = await appRepository.getByAppId(id);
    if (!app) {
      try {
        app = await appRepository.create({ appId: id });
      } catch (err) {
        // Prevent race conditions for delayed app creation
        if (err.name === 'SequelizeUniqueConstraintError') {
          app = await appRepository.getByAppId(id);
        } else {
          throw err;
        }
      }
    }

    setApp(req, app);
  });
}
