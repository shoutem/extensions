import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import { getTableHeaders } from '../../services';
import Table from '../table';
import CmsTableRow from '../cms-table-row';
import CmsActionsMenu from '../cms-actions-menu';

export default class CmsTable extends Component {
  static propTypes = {
    schema: PropTypes.object,
    items: PropTypes.array,
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
