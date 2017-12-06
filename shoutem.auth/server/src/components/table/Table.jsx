import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import TextTableHeader from '../text-table-header';
import InputTableHeader from '../input-table-header';
import SelectTableHeader from '../select-table-header';
import './style.scss';

export default class Table extends Component {
  constructor(props) {
    super(props);

    this.handleTableFilterChange = this.handleTableFilterChange.bind(this);
    this.renderEmptyTableRow = this.renderEmptyTableRow.bind(this);
    this.renderTableHeader = this.renderTableHeader.bind(this);
  }

  handleTableFilterChange(filterId, value) {
    const { onFilterChange } = this.props;
    const filterPatch = {
      [filterId]: value,
    };

    onFilterChange(filterPatch);
  }

  renderEmptyTableRow() {
    const { emptyPlaceholderText, columnHeaders } = this.props;
    const colSpan = _.size(columnHeaders);

    return (
      <tr className="table__empty-row">
        <td colSpan={colSpan}>{emptyPlaceholderText}</td>
      </tr>
    );
  }

  renderTableHeader(columnHeader) {
    const { type, className, id } = columnHeader;

    if (type === 'input') {
      return (
        <InputTableHeader
          className={className}
          header={columnHeader}
          key={id}
          onChange={this.handleTableFilterChange}
        />
      );
    }

    if (type === 'select') {
      return (
        <SelectTableHeader
          className={className}
          header={columnHeader}
          key={id}
          onSelect={this.handleTableFilterChange}
        />
      );
    }

    return (
      <TextTableHeader
        className={className}
        header={columnHeader}
        key={id}
      />
    );
  }

  render() {
    const {
      className,
      items,
      renderItem,
      columnHeaders,
    } = this.props;

    const classes = classNames('table', className);
    const isEmpty = _.isEmpty(items);

    return (
      <table className={classes}>
        <thead>
          <tr>
            {_.map(columnHeaders, this.renderTableHeader)}
          </tr>
        </thead>
        <tbody>
          {isEmpty && this.renderEmptyTableRow()}
          {!isEmpty && _.map(items, renderItem)}
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  className: PropTypes.string,
  /**
   * Text that will be displayed if there are no items in table
   */
  emptyPlaceholderText: PropTypes.string,
  /**
   * Array of column header descriptors.
   */
  columnHeaders: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    helpText: PropTypes.string,
    type: PropTypes.oneOf(['text', 'input', 'select'])
  })).isRequired,
  /**
   * Array of items to display in table
   */
  items: PropTypes.array.isRequired,
  /**
   * Function that renders each item as a table row
   */
  renderItem: PropTypes.func.isRequired,
  /**
   * Callback function called when filter is changed
   */
  onFilterChange: PropTypes.func,
};

Table.defaultProps = {
  emptyPlaceholderText: 'No data to display',
};
