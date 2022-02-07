import _ from 'lodash';
import Sequelize from 'sequelize';
import pluralize from 'pluralize';
import { generateErrorCode } from '../../../error';

export default {
  serialize: (err) => {
    if (err instanceof Sequelize.ForeignKeyConstraintError) {
      const model = _.camelCase(pluralize.singular(_.get(err, 'table')));
      const message = _.upperFirst(_.get(err, 'parent.message'));
      const path = _.upperFirst(message.match(/_(.*)_fkey/)[1]);

      return {
        status: '400',
        title: 'validation error',
        detail: message,
        code: generateErrorCode(model, 'validation', `${model}${path}Invalid`),
        meta: {
          trace: err.stack,
        },
      };
    }
    return null;
  },
};
