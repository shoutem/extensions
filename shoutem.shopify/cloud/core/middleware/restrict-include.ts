import { Request } from 'express';
import _ from 'lodash';
import { asyncMiddleware } from '../../express';
import { ForbiddenError } from '../../error/errors';

export function restrictInclude() {
  return asyncMiddleware(async (req: Request) => {
    const { include } = req.query;
    const includeTokens = _.split(include, ',');

    const accountPresent = _.some(includeTokens, (t) => t === 'account');
    if (includeTokens && accountPresent) {
      throw new ForbiddenError();
    }
  });
}
