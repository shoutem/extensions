import React, { Component, PropTypes } from 'react';
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
    categories: PropTypes.array,
    onUpdateItemCategories: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
    this.renderActionsMenu = this.renderActionsMenu.bind(this);

    const { schema } = props;
    const headers = getTableHeaders(schema);

    this.state = {
      headers,
    };
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
    const { headers } = this.state;
    const { categories, onUpdateItemCategories, mainCategoryId } = this.props;

    return (
      <CmsTableRow
        actionsMenu={this.renderActionsMenu(item)}
        categories={categories}
        headers={headers}
        item={item}
        key={item.id}
        mainCategoryId={mainCategoryId}
        onUpdateItemCategories={onUpdateItemCategories}
      />
    );
  }

  render() {
    const { headers } = this.state;
    const { items, className } = this.props;
    const classes = classNames('cms-table', className);

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
