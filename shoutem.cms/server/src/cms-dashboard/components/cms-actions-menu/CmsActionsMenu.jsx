import React, { Component } from 'react';
import { Button, MenuItem } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { ActionsMenu, FontIcon, IconLabel } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default class CmsActionsMenu extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { additionalActions } = props;
    const actions = this.resolveActions();

    this.state = {
      actions: [...actions, ...additionalActions],
    };
  }

  resolveActions() {
    const {
      canUpdate,
      canDelete,
      canSendPush,
      onDeleteClick,
      onUpdateClick,
      onSendPushClick,
    } = this.props;

    const actions = [];
    if (canUpdate) {
      actions.push({
        icon: 'edit',
        handleClick: () => this.handleActionClick(onUpdateClick),
        label: i18next.t(LOCALIZATION.EDIT_ACTION_LABEL),
      });
    }

    if (canDelete) {
      actions.push({
        icon: 'delete',
        handleClick: () => this.handleActionClick(onDeleteClick),
        label: i18next.t(LOCALIZATION.DELETE_ACTION_LABEL),
      });
    }

    if (canSendPush) {
      actions.push({
        icon: 'engage',
        iconSize: 22,
        handleClick: () => this.handleActionClick(onSendPushClick),
        label: i18next.t(LOCALIZATION.EDIT_ACTION_LABEL),
      });
    }

    return actions;
  }

  handleActionClick(onClickCallback) {
    const { item } = this.props;
    onClickCallback(item);
  }

  renderAsDropdown(actions) {
    return (
      <ActionsMenu
        className="cms-actions-menu__dropdown pull-right"
        id="cms-actions-menu__inline"
      >
        {_.map(actions, action => (
          <MenuItem key={action.label} onClick={action.handleClick}>
            <IconLabel iconName={action.icon}>{action.label}</IconLabel>
          </MenuItem>
        ))}
      </ActionsMenu>
    );
  }

  renderAsInline(actions) {
    return (
      <div className="cms-actions-menu__inline">
        {_.map(actions, action => (
          <Button
            className="btn-icon pull-right"
            key={action.label}
            onClick={action.handleClick}
          >
            <FontIcon name={action.icon} size={action.iconSize || 24} />
          </Button>
        ))}
      </div>
    );
  }

  render() {
    const { inline } = this.props;
    const { actions } = this.state;

    if (_.isEmpty(actions)) {
      return null;
    }

    return (
      <div className="cms-actions-menu">
        {inline && this.renderAsInline(actions)}
        {!inline && this.renderAsDropdown(actions)}
      </div>
    );
  }
}

CmsActionsMenu.propTypes = {
  item: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onSendPushClick: PropTypes.func.isRequired,
  onUpdateClick: PropTypes.func.isRequired,
  additionalActions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      label: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ),
  canDelete: PropTypes.bool,
  canSendPush: PropTypes.bool,
  canUpdate: PropTypes.bool,
  inline: PropTypes.bool,
};

CmsActionsMenu.defaultProps = {
  canUpdate: true,
  canDelete: true,
  canSendPush: false,
  inline: true,
  additionalActions: [],
};
