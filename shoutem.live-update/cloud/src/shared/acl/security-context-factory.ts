import JwtSecurityContext from './jwt-security-context';

export default function factory(type, token) {
  if (type === 'jwt') {
    return new JwtSecurityContext(token);
  }

  throw new TypeError('Unknown security context type.');
}
