import React from 'react';
import { Table } from 'react-bootstrap';
import { head, keys, map, values } from 'lodash';
import PropTypes from 'prop-types';
import './style.scss';

export function AnalyticsTable(props) {
  const { data, title, headers } = props;

  function renderTable() {
    // Data consists of objects with shape { screen: value }
    return map(data, row => (
      <tr key={head(keys(row))}>
        <td>{head(keys(row))}</td>
        <td>{head(values(row))}</td>
      </tr>
    ));
  }

  function renderTableHeaders() {
    return map(headers, header => <th key={header}>{header}</th>);
  }

  return (
    <Table className="analytics-table__table-container">
      <caption>{title}</caption>
      <thead>
        <tr>{renderTableHeaders()}</tr>
      </thead>
      <tbody>{renderTable()}</tbody>
    </Table>
  );
}

AnalyticsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default React.memo(AnalyticsTable);
