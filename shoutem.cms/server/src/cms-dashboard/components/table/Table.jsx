import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import _ from 'lodash';
import i18next from 'i18next';
import { List } from 'react-movable';
import { HEADER_TYPES } from '../../services';
import TextTableHeader from '../text-table-header';
import InputTableHeader from '../input-table-header';
import SelectTableHeader from '../select-table-header';
import LOCALIZATION from './localization';
import './style.scss';

export default class Table extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.sortableRef = createRef();

    this.state = {
      widths: [],
      sortableContainer: null,
    };
  }

  componentDidMount() {
    this.setState({ sortableContainer: this.sortableRef.current });
  }

  handleTableFilterChange(filterId, value) {
    const { onFilterChange } = this.props;
    const filterPatch = {
      [filterId]: value,
    };

    onFilterChange(filterPatch);
  }

  handleBeforeDrag({ elements, index }) {
    const cells = Array.from(elements[index].children);
    const widths = cells.map(cell => window.getComputedStyle(cell).width);
    this.setState({ widths });
  }

  handleItemIndexChange({ oldIndex, newIndex }) {
    const { items, onItemIndexChange } = this.props;
    const itemMoving = _.get(items, `[${oldIndex}]`);

    if (_.isFunction(onItemIndexChange)) {
      return onItemIndexChange(newIndex, itemMoving);
    }
  }

  renderEmptyTableRow() {
    const { emptyPlaceholderText, columnHeaders } = this.props;
    const colSpan = _.size(columnHeaders);

    const text =
      emptyPlaceholderText || i18next.t(LOCALIZATION.EMPTY_PLACEHOLDER_LABEL);

    return (
      <tr className="table__empty-row">
        <td colSpan={colSpan}>{text}</td>
      </tr>
    );
  }

  renderTableHeader(columnHeader) {
    const { type, className, id } = columnHeader;

    if (type === HEADER_TYPES.INPUT) {
      return (
        <InputTableHeader
          className={className}
          header={columnHeader}
          key={id}
          onChange={this.handleTableFilterChange}
        />
      );
    }

    if (type === HEADER_TYPES.SELECT) {
      return (
        <SelectTableHeader
          className={className}
          header={columnHeader}
          key={id}
          onSelect={this.handleTableFilterChange}
        />
      );
    }

    if (type === HEADER_TYPES.TEXT) {
      return (
        <TextTableHeader className={className} header={columnHeader} key={id} />
      );
    }

    return <th key={id} className={className}></th>;
  }

  renderSortableList({ children, props }) {
    return <tbody {...props}>{children}</tbody>;
  }

  renderSortableItem({ value, props, isDragged }) {
    const { renderItem } = this.props;
    const { widths } = this.state;

    let customStyle = {
      ...props.style,
    };

    if (isDragged) {
      customStyle.backgroundColor = 'rgba(0, 170, 223, 0.1)';
      customStyle.color = '#444f6c';
    }

    _.unset(customStyle, 'zIndex');
    const customProps = {
      ...props,
      tdWidths: widths,
      style: customStyle,
    };

    return renderItem(value, customProps);
  }

  renderSortableTable() {
    const { items } = this.props;
    const { sortableContainer } = this.state;

    if (!sortableContainer) {
      return null;
    }

    return (
      <List
        lockVertically
        container={sortableContainer}
        values={items}
        beforeDrag={this.handleBeforeDrag}
        onChange={this.handleItemIndexChange}
        renderList={this.renderSortableList}
        renderItem={this.renderSortableItem}
      />
    );
  }

  renderTable() {
    const { items, renderItem } = this.props;
    return <tbody>{_.map(items, renderItem)}</tbody>;
  }

  render() {
    const { className, items, columnHeaders, sortable } = this.props;

    const classes = classNames('table', className);
    const isEmpty = _.isEmpty(items);

    return (
      <table className={classes}>
        <thead>
          <tr>{_.map(columnHeaders, this.renderTableHeader)}</tr>
        </thead>
        <tbody ref={this.sortableRef} className="drag-body-wrapper"></tbody>
        {isEmpty && <tbody>{this.renderEmptyTableRow()}</tbody>}
        {!isEmpty &&
          (sortable ? this.renderSortableTable() : this.renderTable())}
      </table>
    );
  }
}

Table.propTypes = {
  className: PropTypes.string,
  sortable: PropTypes.bool,
  /**
   * Text that will be displayed if there are no items in table
   */
  emptyPlaceholderText: PropTypes.string,
  /**
   * Array of column header descriptors.
   */
  columnHeaders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string,
      helpText: PropTypes.string,
      type: PropTypes.oneOf(['text', 'input', 'select']),
    }),
  ).isRequired,
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
  onItemIndexChange: PropTypes.func,
};
