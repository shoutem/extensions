import _ from 'lodash';
import { HttpErrorWithMeta } from '../errors/error-meta';

function getTrace(err: Error) {
  if (err instanceof Error) {
    return err.stack;
  }

  try {
    return JSON.stringify(err);
  } catch (e) {
    return err;
  }
}

function adjustError(err: Error) {
  const meta = {
    trace: getTrace(err),
  };

  if (err instanceof HttpErrorWithMeta) {
    // eslint-disable-next-line no-return-assign
    _.forOwn(err.meta, (value, key) => (meta[key] = value));
  }

  return {
    status: '500',
    title: 'server error',
    meta,
  };
}

function serialize(err: Error | Error[]) {
  if (_.isArray(err)) {
    return _.map(err, (error) => adjustError(error));
  }
  return adjustError(err);
}

export default {
  serialize,
};
