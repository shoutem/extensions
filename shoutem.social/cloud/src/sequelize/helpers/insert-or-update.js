import _ from 'lodash';
import Promise from 'bluebird';

export function insertOrUpdate(table, items, queryInterface) {
  return Promise.each(items, (item) => {
    // Escape single quotes in values that contain them
    Object.keys(item).forEach((key) => {
      if (_.isString(item[key])) {
        const value = item[key];
        item[key] = value.replace(/'/g, `''`);
      }
    });
    const columns = Object.keys(item);
    const columnUpdateRules = _.map(columns, (column) => `"${column}" = excluded."${column}"`);
    const columnsFormatted = `("${columns.join('", "')}")`;
    const valuesFormatted = `('${Object.values(item).join("', '")}')`;
    const columnUpdateRulesFormatted = columnUpdateRules.join(', ');

    return queryInterface.sequelize.query(
      `
        INSERT INTO "public"."${table}" ${columnsFormatted} 
        VALUES ${valuesFormatted}
        ON CONFLICT (id) DO UPDATE 
        SET ${columnUpdateRulesFormatted};
      `,
    );
  });
}
