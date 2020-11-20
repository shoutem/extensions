import _ from 'lodash';

const HEADER_TYPES = {
  TEXT: 'text',
  INPUT: 'input',
  SELECT: 'select',
};

const CATEGORY_HEADER = {
  id: 'categories',
  title: 'Categories',
  component: 'CategorySelector',
  format: 'categories',
};

function getDefaultTableLayout(schema) {
  const { titleProperty } = schema;

  return {
    columns: [titleProperty],
  };
}

function getColumnOptions(column, properties) {
  if (_.isString(column)) {
    return _.get(properties, column);
  }

  const { name: propName } = column;
  // format and type cannot be overridden
  const columnProps = _.omit(column, ['format', 'type']);
  const schemaProp = _.get(properties, propName);

  return {
    ...schemaProp,
    ...columnProps,
  };
}

function getTableHeaderType(type) {
  if (_.includes(HEADER_TYPES, type)) {
    return type;
  }

  return HEADER_TYPES.TEXT;
}

function getTableHeader(column, properties) {
  const isCategoryColumn = column.name === 'categories';
  if (isCategoryColumn) {
    return CATEGORY_HEADER;
  }

  const columnOptions = getColumnOptions(column, properties);
  const { name, type, title, ...otherOptions } = columnOptions;

  const id = _.isString(column) ? column : name;
  const className = `cms-table__${id}-header`;

  return {
    id,
    className,
    type: getTableHeaderType(type),
    value: title,
    ...otherOptions,
  };
}

export function getTableHeaders(schema) {
  const tableLayout =
    _.get(schema, 'layouts.table') || getDefaultTableLayout(schema);

  const { properties } = schema;
  const { columns } = tableLayout;

  return _.map(columns, column => getTableHeader(column, properties));
}
