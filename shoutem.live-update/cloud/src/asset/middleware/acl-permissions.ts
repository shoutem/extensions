import { errors } from '../../shared/error';
import { asyncMiddleware } from '../../shared/express';
import { getAuthData } from '../../shared/auth';
import { isAllowedForApplication } from '../../application';
import { getApp } from '../../app';

export function assertCanUpload() {
  return asyncMiddleware(async req => {
    const authData = getAuthData(req);
    const app = getApp(req);

    const allowed = await isAllowedForApplication('update', app.appId, authData);
    if (!allowed) {
      throw new errors.ForbiddenError();
    }
  });
}
