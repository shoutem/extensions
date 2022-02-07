import _ from 'lodash';
import Sequelize from 'sequelize';
import { generateErrorCode } from '../../../error';

export default {
  serialize: (err) => {
    if (err instanceof Sequelize.ValidationError) {
      return _.map(err.errors, (error) => {
        const model = _.camelCase(_.get(error, 'instance._modelOptions.name.singular'));
        const pathLower = _.camelCase(_.get(error, 'path'));
        const path = _.upperFirst(pathLower);

        return {
          status: '400',
          title: 'validation error',
          detail: _.upperFirst(_.get(error, 'message')),
          code: generateErrorCode(model, 'validation', `${model}${path}Invalid`),
          meta: {
            trace: err.stack,
            propertyName: pathLower,
          },
        };
      });
    }

    return null;
  },
};
