import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { getTableHeaders } from '../../services';
import CmsActionsMenu from '../cms-actions-menu';
import CmsTableRow from '../cms-table-row';
import Table from '../table';
import './style.scss';

export default class CmsTable extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  renderActionsMenu(item) {
    const {
      actionsInline,
      canSendPush,
      canDelete,
      canUpdate,
      onDeleteClick,
      onUpdateClick,
      onSendPushClick,
    } = this.props;

    return (
      <CmsActionsMenu
        canSendPush={canSendPush}
        canDelete={canDelete}
        canUpdate={canUpdate}
        inline={actionsInline}
        item={item}
        onDeleteClick={onDeleteClick}
        onUpdateClick={onUpdateClick}
        onSendPushClick={onSendPushClick}
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

CmsTable.propTypes = {
  onDeleteClick: PropTypes.func.isRequired,
  onSendPushClick: PropTypes.func.isRequired,
  onUpdateClick: PropTypes.func.isRequired,
  onUpdateItemCategories: PropTypes.func.isRequired,
  onUpdateItemIndex: PropTypes.func.isRequired,
  onUpdateItemLanguages: PropTypes.func.isRequired,
  actionsInline: PropTypes.bool,
  additionalActions: PropTypes.array,
  canDelete: PropTypes.bool,
  canSendPush: PropTypes.bool,
  canUpdate: PropTypes.bool,
  categories: PropTypes.array,
  className: PropTypes.string,
  items: PropTypes.array,
  languages: PropTypes.array,
  mainCategoryId: PropTypes.string,
  schema: PropTypes.object,
  sortable: PropTypes.bool,
};
