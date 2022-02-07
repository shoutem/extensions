import { errors } from '../../error';

const { NotFoundError } = errors;

// There's no favicon.ico by default on the server and those
// requests are ignored. If you need it favicon.ico, use
// https://www.npmjs.com/package/serve-favicon
export default () => (req, res, next) => {
  if (req.originalUrl === '/favicon.ico') {
    return next(new NotFoundError());
  }

  return next();
};
