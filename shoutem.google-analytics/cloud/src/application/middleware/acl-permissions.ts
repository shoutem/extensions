import { errors } from '../../shared/error';
import { asyncMiddleware } from '../../shared/express';
import { getAuthData } from '../../shared/auth';
import { getApplication } from '../service';

export function assertCanRead() {
  return asyncMiddleware(async req => {
    const authData = getAuthData(req);
    const application = getApplication(req);

    if (!authData.securityContext.isAllowed('read', 'shoutem.core.applications', application)) {
      throw new errors.ForbiddenError();
    }
  });
}

export function assertCanUpdate() {
  return asyncMiddleware(async req => {
    const authData = getAuthData(req);
    const application = getApplication(req);

    if (!authData.securityContext.isAllowed('update', 'shoutem.core.applications', application)) {
      throw new errors.ForbiddenError();
    }
  });
}
