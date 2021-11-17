import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { MenuItem } from 'react-bootstrap';
import classNames from 'classnames';
import i18next from 'i18next';
import { FontIcon, ActionsMenu, IconLabel } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default class CategoryTreeItem extends Component {
  static propTypes = {
    category: PropTypes.object,
    onCategoryRenameClick: PropTypes.func,
    onCategoryDeleteClick: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleCategoryRenameClick() {
    const { category, onCategoryRenameClick } = this.props;
    onCategoryRenameClick(category);
  }

  handleCategoryDeleteClick() {
    const { category, onCategoryDeleteClick } = this.props;
    onCategoryDeleteClick(category);
  }

  renderRenameOption() {
    return (
      <MenuItem onClick={this.handleCategoryRenameClick}>
        <IconLabel iconName="edit">
          {i18next.t(LOCALIZATION.BUTTON_RENAME_LABEL)}
        </IconLabel>
      </MenuItem>
    );
  }

  renderDeleteOption() {
    return (
      <MenuItem onClick={this.handleCategoryDeleteClick}>
        <IconLabel iconName="delete">
          {i18next.t(LOCALIZATION.BUTTON_DELETE_LABEL)}
        </IconLabel>
      </MenuItem>
    );
  }

  // should receive options on what actions are permissible(rename, delete)
  // while still keeping backwards compatibility with old isStatic behaviour by using it as a
  // blanket yes/no for all actions in case no actions are explicitly defined as permissible
  renderMenuOptions(allActionsAllowed, actionWhitelist) {
    const canRename =
      allActionsAllowed ||
      !!_.find(actionWhitelist, action => action === 'rename');
    const canDelete =
      allActionsAllowed ||
      !!_.find(actionWhitelist, action => action === 'delete');

    return (
      <ActionsMenu
        className="cms-actions-menu__dropdown"
        id="cms-actions-menu__inline"
      >
        {canRename && this.renderRenameOption()}
        {canDelete && this.renderDeleteOption()}
      </ActionsMenu>
    );
  }

  render() {
    const { category } = this.props;
    const { actionWhitelist, name, icon, isStatic, className } = category;

    const hasActions = !isStatic || !_.isEmpty(actionWhitelist);

    const classes = classNames('category-tree-item', className, {
      'has-actions': hasActions,
    });

    return (
      <div className={classes}>
        {icon && <FontIcon name={icon} size="24px" />}
        {name && (
          <div className="category-tree-item__name text-ellipsis">{name}</div>
        )}
        {hasActions && this.renderMenuOptions(!isStatic, actionWhitelist)}
      </div>
    );
  }
}
