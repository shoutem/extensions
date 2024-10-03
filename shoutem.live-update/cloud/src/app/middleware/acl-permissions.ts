import { errors } from '../../shared/error';
import { asyncMiddleware } from '../../shared/express';
import { getAuthData } from '../../shared/auth';
import { isAllowedForApplication } from '../../application';
import { getApp } from '../service';

export function assertCanAccess() {
  return asyncMiddleware(async req => {
    const authData = getAuthData(req);
    const app = getApp(req);

    const allowed = await isAllowedForApplication('access', app.appId, authData);
    if (!allowed) {
      throw new errors.ForbiddenError();
    }
  });
}

export function assertCanUpdate() {
  return asyncMiddleware(async req => {
    const authData = getAuthData(req);
    const app = getApp(req);

    const allowed = await isAllowedForApplication('update', app.appId, authData);
    if (!allowed) {
      throw new errors.ForbiddenError();
    }
  });
}
