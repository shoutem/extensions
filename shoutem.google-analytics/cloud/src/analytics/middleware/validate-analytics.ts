import _ from 'lodash';
import { errors } from '../../shared/error';
import { asyncMiddleware } from '../../shared/express';
import { io } from '../../shared/io';

export default function() {
  return asyncMiddleware(async req => {
    const filter = io.getFilter(req) || {};

    if (_.isEmpty(filter.from)) {
      throw new errors.ValidationError(`param 'from' is missing`);
    }

    if (_.isEmpty(filter.to)) {
      throw new errors.ValidationError(`param 'to' is missing`);
    }
  });
}
