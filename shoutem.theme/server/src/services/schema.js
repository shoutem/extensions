import _ from 'lodash';
import { cloneStatus } from '@shoutem/redux-io';

export function prepareSchemaForCustomFonts(schema, fonts) {
  if (_.isEmpty(fonts)) {
    return schema;
  }

  const clonedSchema = _.cloneDeep(schema);
  cloneStatus(schema, clonedSchema);

  const customFonts = _.map(fonts, 'name');
  const schemaFonts = _.get(
    clonedSchema,
    'formats.font.constraints.fontFamily.enum',
    [],
  );

  const allFonts = _.uniq([...schemaFonts, ...customFonts]);
  _.set(clonedSchema, 'formats.font.constraints.fontFamily.enum', allFonts);

  return clonedSchema;
}
