import _ from 'lodash';
import Sequelize from 'sequelize';
import { generateErrorCode } from '../../../error';

export default {
  serialize: (err) => {
    if (err instanceof Sequelize.UniqueConstraintError) {
      return _.map(err.errors, (error) => {
        const model = _.camelCase(_.get(error, 'instance._modelOptions.name.singular'));
        const path = _.upperFirst(_.camelCase(_.get(error, 'path')));

        return {
          status: '409',
          title: 'conflict error',
          detail: _.upperFirst(_.get(error, 'message')),
          code: generateErrorCode(model, 'conflict', `${model}${path}Conflict`),
          meta: {
            trace: err.stack,
          },
        };
      });
    }
    return null;
  },
};
