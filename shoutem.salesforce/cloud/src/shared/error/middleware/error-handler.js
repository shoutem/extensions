import _ from 'lodash';
import httpErrorAdapter from '../adapters/http-error-adapter';
import defaultErrorAdapter from '../adapters/default-error-adapter';

export default (settings = { showFullError: false }) => {
  const adapters = settings.customAdapters || [];

  adapters.push(httpErrorAdapter);
  adapters.push(defaultErrorAdapter);

  return (err, req, res, next) => {
    try {
      let i = 0;
      let error = null;
      do {
        error = adapters[i++].serialize(err);
      } while (!error);

      // According to JSON API spec, error response always contains an array
      // of errors.
      const errors = _.isArray(error) ? error : [error];
      const status = parseInt(errors[0].status, 10);
      if (!settings.showFullError) {
        _.forEach(errors, (e) => {
          delete e.meta;
        });
      }
      res.status(status).json({ errors });
      next({ errors });
    } catch (exc) {
      const errors = {
        errors: [
          {
            title: 'server error',
            status: '500',
          },
        ],
      };
      if (settings.showFullError) {
        errors.errors[0].meta = {
          trace: exc,
        };
      }
      res.status(500).json(errors);
      next(errors);
    }
  };
};
