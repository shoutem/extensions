import { requireEnvString } from '../../env';

const jwt = {
  secret: requireEnvString('JWT_SECRET'),
  algorithm: requireEnvString('JWT_ALGORITHM'),
  issuer: requireEnvString('JWT_ISSUER'),
  realm: requireEnvString('JWT_REALM'),
  subjectTypes: ['user', 'service', 'application'],
};

export default jwt;
