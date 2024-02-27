import passport from 'passport';
import passportShoutem from '@shoutem/passport-shoutem';
import { errors } from '../../error';
import { securityContextFactory } from '../../acl';
import jwtConfig from '../config/jwt';
import authConfig from '../config/auth';
import { setAuthData } from './auth';

export default () => {
  passport.use(
    passportShoutem({
      jwtSecret: jwtConfig.secret,
      jwtAlgorithm: jwtConfig.algorithm,
      jwtIssuer: jwtConfig.issuer,
      jwtRealm: jwtConfig.realm,
      jwtSubjectTypes: jwtConfig.subjectTypes,
      authServiceUrl: authConfig.endpoint,
    }),
  );

  return (req, res, next) => {
    passport.authenticate('shoutem', (err, subject) => {
      if (err) {
        next(err);
        return;
      }

      if (!subject && req.headers.authorization) {
        next(new errors.NotAuthorizedError());
        return;
      }

      setAuthData(req, {
        securityContext: securityContextFactory('jwt', subject.token),
        acl: subject.acl,
      });

      next();
    })(req, res, next);
  };
};
