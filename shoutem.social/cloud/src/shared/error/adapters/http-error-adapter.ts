import _ from 'lodash';
import { HttpError } from '../errors';
import { HttpErrorWithMeta } from '../errors/error-meta';

function adjustError(err: HttpError) {
  if (err instanceof HttpError) {
    const meta = {
      trace: err.stack,
    };

    if (err instanceof HttpErrorWithMeta) {
      // eslint-disable-next-line no-return-assign
      _.forOwn(err.meta, (value, key) => (meta[key] = value));
    }

    return {
      status: err.status,
      title: err.title,
      detail: err.detail,
      code: err.code,
      meta,
    };
  }

  return null;
}

function serialize(err: HttpError | HttpError[]) {
  if (_.isArray(err)) {
    return _.map(err, (error) => adjustError(error));
  }

  return adjustError(err);
}

export default {
  serialize,
};
