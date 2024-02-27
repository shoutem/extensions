import { NotFoundError } from '../errors';

export default () => (req, res, next) => {
  // throw error only if response has not been prepared by other middleware
  if (res.headersSent) {
    next();
  } else {
    next(new NotFoundError('Resource not found'));
  }
};
