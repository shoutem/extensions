import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import i18next from 'i18next';
import { MenuItem, Button } from 'react-bootstrap';
import { IconLabel, ActionsMenu, FontIcon } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default class CmsActionsMenu extends Component {
  static propTypes = {
    item: PropTypes.object,
    canUpdate: PropTypes.bool,
    canDelete: PropTypes.bool,
    inline: PropTypes.bool,
    onUpdateClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    additionalActions: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string,
        label: PropTypes.string,
        onClick: PropTypes.func,
      }),
    ),
  };

  static defaultProps = {
    canUpdate: true,
    canDelete: true,
    inline: true,
    additionalActions: [],
  };

  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  componentWillMount() {
    this.resolveActions();
  }

  resolveActions() {
    const {
      canUpdate,
      canDelete,
      onDeleteClick,
      onUpdateClick,
      additionalActions,
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

    this.setState({
      actions: [...actions, ...additionalActions],
    });
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
            <FontIcon name={action.icon} size={24} />
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
