import { Request } from 'express';
import { asyncMiddleware } from '../../../src/shared/express';
import { errors } from '../../../src/shared/error';
import { getAuthToken } from '../service';

export default function () {
  return asyncMiddleware(async (req: Request) => {
    const token = getAuthToken(req);
    if (!token) {
      throw new errors.NotAuthorizedError('User is not authenticated');
    }
  });
}
