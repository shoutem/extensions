import { asyncParamMiddleware } from '../../shared/express';
import { errors, generateErrorCode } from '../../shared/error';
import { getAuthData } from '../../shared/auth';
import { isAllowedForApplication } from '../../application';
import appRepository from '../data/app-repository';
import { setApp } from '../service';

export default function() {
  return asyncParamMiddleware(async (req, res, id) => {
    if (!id) {
      throw new errors.NotFoundError('App id missing', generateErrorCode('app', 'notFound', 'appIdMissing'));
    }

    let app = await appRepository.getByAppId(id);
    if (!app) {
      // if there is no permission to read an app, throw an error, do not create app automatically
      const authData = getAuthData(req);
      const allowed = await isAllowedForApplication('read', id, authData);
      if (!allowed) {
        throw new errors.ForbiddenError();
      }

      try {
        const newApp = await appRepository.create({ appId: id });
        setApp(req, newApp);
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
