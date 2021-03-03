import { Request } from 'express';
import { asyncMiddleware } from '../../../src/shared/express';
import { errors } from '../../../src/shared/error';
import { logger } from '../../../src/shared/logging';
import { setAuthToken } from '../service';
import { ERROR_MESSAGES, ERROR_CODES } from '../const';
import { TokenData } from '../service/token';

export interface TokenProvider {
  validateToken(data: string): Promise<TokenData>;
}

export default function (tokenProvider: TokenProvider) {
  return asyncMiddleware(async (req: Request) => {
    let token;

    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      const scheme = parts[0];
      const credentials = parts[1] || '';
      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    }

    if (!token) {
      return;
    }

    try {
      const tokenData = await tokenProvider.validateToken(token);
      setAuthToken(req, tokenData);
    } catch (err) {
      logger.info(err, 'Auth token verification error.');

      throw new errors.NotAuthorizedError(ERROR_MESSAGES.INVALID_TOKEN, ERROR_CODES.INVALID_TOKEN);
    }
  });
}
