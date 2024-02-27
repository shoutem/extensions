import { asyncParamMiddleware } from '../../shared/express';
import { errors, generateErrorCode } from '../../shared/error';
import { getAuthData } from '../../shared/auth';
import { setApplication } from '../service';
import applicationRepository from '../data/application-repository';

export default function() {
  return asyncParamMiddleware(async (req, res, id) => {
    if (!id) {
      throw new errors.NotFoundError('App id missing', generateErrorCode('app', 'notFound', 'appIdMissing'));
    }

    // load app from app-manager
    const application = await applicationRepository.get(id);

    const authData = getAuthData(req);
    if (!authData.securityContext.isAllowed('read', 'shoutem.core.applications', application)) {
      throw new errors.ForbiddenError();
    }

    setApplication(req, application);
  });
}
