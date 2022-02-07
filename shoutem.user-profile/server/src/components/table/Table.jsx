import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import InputTableHeader from '../input-table-header';
import SelectTableHeader from '../select-table-header';
import TextTableHeader from '../text-table-header';
import LOCALIZATION from './localization';
import './style.scss';

export default class Table extends PureComponent {
  constructor(props) {
    super(props);
    autoBindReact(this);
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
      <TextTableHeader className={className} header={columnHeader} key={id} />
    );
  }

  render() {
    const { className, items, renderItem, columnHeaders } = this.props;

    const classes = classNames('table', className);
    const isEmpty = _.isEmpty(items);

    return (
      <table className={classes}>
        <thead>
          <tr>{_.map(columnHeaders, this.renderTableHeader)}</tr>
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
  columnHeaders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'input', 'select']).isRequired,
      helpText: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  emptyPlaceholderText: PropTypes.string,
};

Table.defaultProps = {
  className: null,
  emptyPlaceholderText: i18next.t(LOCALIZATION.EMPTY_PLACEHOLDER_MESSAGE),
};
