import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import { getTableHeaders } from '../../services';
import Table from '../table';
import CmsTableRow from '../cms-table-row';
import CmsActionsMenu from '../cms-actions-menu';
import './style.scss';

export default class CmsTable extends Component {
  static propTypes = {
    schema: PropTypes.object,
    items: PropTypes.array,
    sortable: PropTypes.bool,
    mainCategoryId: PropTypes.string,
    className: PropTypes.string,
    canDelete: PropTypes.bool,
    canUpdate: PropTypes.bool,
    onUpdateClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    additionalActions: PropTypes.array,
    actionsInline: PropTypes.bool,
    languages: PropTypes.array,
    categories: PropTypes.array,
    onUpdateItemCategories: PropTypes.func,
    onUpdateItemLanguages: PropTypes.func,
    onUpdateItemIndex: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  renderActionsMenu(item) {
    const {
      actionsInline,
      canDelete,
      canUpdate,
      onDeleteClick,
      onUpdateClick,
    } = this.props;

    return (
      <CmsActionsMenu
        canDelete={canDelete}
        canUpdate={canUpdate}
        inline={actionsInline}
        item={item}
        onDeleteClick={onDeleteClick}
        onUpdateClick={onUpdateClick}
      />
    );
  }

  renderItem(item, rowProps) {
    const {
      schema,
      languages,
      sortable,
      categories,
      mainCategoryId,
      onUpdateItemCategories,
      onUpdateItemLanguages,
    } = this.props;

    const headers = getTableHeaders(schema, categories, languages, sortable);

    return (
      <CmsTableRow
        rowProps={rowProps}
        actionsMenu={this.renderActionsMenu(item)}
        languages={languages}
        categories={categories}
        headers={headers}
        item={item}
        key={item.id}
        mainCategoryId={mainCategoryId}
        onUpdateItemCategories={onUpdateItemCategories}
        onUpdateItemLanguages={onUpdateItemLanguages}
      />
    );
  }

  render() {
    const {
      schema,
      categories,
      languages,
      sortable,
      onUpdateItemIndex,
    } = this.props;
    const { items, className } = this.props;

    const classes = classNames('cms-table', className);
    const headers = getTableHeaders(schema, categories, languages, sortable);

    return (
      <Table
        className={classes}
        columnHeaders={headers}
        items={items}
        sortable={sortable}
        onItemIndexChange={onUpdateItemIndex}
        renderItem={this.renderItem}
      />
    );
  }
}
