import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { getTableHeaders } from '../../services';
import CmsActionsMenu from '../cms-actions-menu';
import CmsTableRow from '../cms-table-row';
import Table from '../table';

export default class CmsTable extends Component {
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

  renderItem(item) {
    const {
      schema,
      languages,
      categories,
      mainCategoryId,
      onUpdateItemCategories,
      onUpdateItemLanguages,
    } = this.props;

    const headers = getTableHeaders(schema, categories, languages);

    return (
      <CmsTableRow
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
    const { schema, categories, languages } = this.props;
    const { items, className } = this.props;
    const classes = classNames('cms-table', className);
    const headers = getTableHeaders(schema, categories, languages);

    return (
      <Table
        className={classes}
        columnHeaders={headers}
        items={items}
        renderItem={this.renderItem}
      />
    );
  }
}

CmsTable.propTypes = {
  actionsInline: PropTypes.bool,
  additionalActions: PropTypes.array,
  canDelete: PropTypes.bool,
  canUpdate: PropTypes.bool,
  categories: PropTypes.array,
  className: PropTypes.string,
  items: PropTypes.array,
  languages: PropTypes.array,
  mainCategoryId: PropTypes.string,
  schema: PropTypes.object,
  onDeleteClick: PropTypes.func,
  onUpdateClick: PropTypes.func,
  onUpdateItemCategories: PropTypes.func,
  onUpdateItemLanguages: PropTypes.func,
};
