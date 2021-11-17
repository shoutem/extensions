import _ from 'lodash';
import i18next from 'i18next';
import { getLayoutsTable } from './schema';
import LOCALIZATION from './localization';

export const HEADER_TYPES = {
  TEXT: 'text',
  INPUT: 'input',
  SELECT: 'select',
};

function getDefaultTableLayout(schema) {
  const { titleProperty } = schema;

  return {
    columns: [
      titleProperty,
      {
        name: 'languages',
      },
      {
        name: 'categories',
      },
    ],
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

function getTableHeader(column, properties, categories, languages) {
  const columnName = _.get(column, 'name');

  if (columnName === 'categories') {
    if (_.isEmpty(categories)) {
      return null;
    }

    return {
      id: 'categories',
      value: i18next.t(LOCALIZATION.CATEGORY_SELECTOR_TITLE),
      title: i18next.t(LOCALIZATION.CATEGORY_SELECTOR_TITLE),
      type: HEADER_TYPES.TEXT,
      component: 'CategorySelector',
      format: 'categories',
    };
  }

  if (columnName === 'languages') {
    if (_.isEmpty(languages)) {
      return null;
    }

    return {
      id: 'channels',
      value: i18next.t(LOCALIZATION.LANGUAGE_SELECTOR_TITLE),
      title: i18next.t(LOCALIZATION.LANGUAGE_SELECTOR_TITLE),
      type: HEADER_TYPES.TEXT,
      component: 'LanguageSelector',
      format: 'languages',
    };
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

export function getTableHeaders(schema, categories, languages) {
  const tableLayout = getLayoutsTable(schema) || getDefaultTableLayout(schema);

  const { properties } = schema;
  const { columns } = tableLayout;

  const tableHeaders = _.compact(
    _.map(columns, column =>
      getTableHeader(column, properties, categories, languages),
    ),
  );

  // added one extra empty table header for cms actions
  tableHeaders.push({ id: 'actions', format: 'actions' });

  return tableHeaders;
}
