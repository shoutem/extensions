import PropTypes from 'prop-types';
import React, { Component } from 'react';
import i18next from 'i18next';
import autoBindReact from 'auto-bind/react';
import { Switch, ActionsMenu, IconLabel } from '@shoutem/react-web-ui';
import { MenuItem } from 'react-bootstrap';
import LOCALIZATION from './localization';
import './style.scss';

export default class UserGroupTableRow extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleRenameGroupClick() {
    const { userGroup } = this.props;
    this.props.onRenameGroupClick(userGroup);
  }

  handleDeleteGroupClick() {
    const { userGroup } = this.props;
    this.props.onDeleteGroupClick(userGroup);
  }

  handleGroupDefaultToggle() {
    const {
      userGroup: { id: groupId, isDefault },
    } = this.props;

    const groupPatch = { isDefault: !isDefault };
    this.props.onUpdateGroupClick(groupId, groupPatch);
  }

  render() {
    const {
      userGroup: { name, isDefault },
    } = this.props;

    return (
      <tr className="user-group-table-row">
        <td className="text-ellipsis">{name}</td>
        <td className="text-ellipsis">
          <Switch
            checked={isDefault}
            className="user-group-table-row__switch"
            onChange={this.handleGroupDefaultToggle}
          />
        </td>
        <td>
          <ActionsMenu
            id="user-groups-actions-menu"
            className="user-groups-actions-menu pull-right"
          >
            <MenuItem onClick={this.handleRenameGroupClick}>
              <IconLabel iconName="edit">
                {i18next.t(LOCALIZATION.BUTTON_EDIT_TITLE)}
              </IconLabel>
            </MenuItem>
            <MenuItem onClick={this.handleDeleteGroupClick}>
              <IconLabel iconName="delete">
                {i18next.t(LOCALIZATION.BUTTON_DELETE_TITLE)}
              </IconLabel>
            </MenuItem>
          </ActionsMenu>
        </td>
      </tr>
    );
  }
}

UserGroupTableRow.propTypes = {
  userGroup: PropTypes.object,
  onRenameGroupClick: PropTypes.func,
  onUpdateGroupClick: PropTypes.func,
  onDeleteGroupClick: PropTypes.func,
};
