import React, { Component, PropTypes } from 'react';
import { MenuItem } from 'react-bootstrap';
import {
  Dropdown,
  FontIcon,
  IconLabel,
} from '@shoutem/react-web-ui';

export default class MemberTableRowActionMenu extends Component {
  constructor(props) {
    super(props);

    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleChangePasswordClick = this.handleChangePasswordClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.renderStatusMenuItem = this.renderStatusMenuItem.bind(this);
    this.renderOwnerDropdownMenu = this.renderOwnerDropdownMenu.bind(this);
    this.renderDefaultDropdownMenu = this.renderDefaultDropdownMenu.bind(this);
  }

  handleStatusChange(approved) {
    const { member, onMemberUpdate } = this.props;
    onMemberUpdate({ ...member, approved });
  }

  handleChangePasswordClick() {
    const { member, onEditClick } = this.props;
    onEditClick(member, true);
  }

  handleDeleteClick() {
    const { member, onDeleteClick } = this.props;
    onDeleteClick(member.id);
  }

  handleEditClick() {
    const { member, onEditClick } = this.props;
    onEditClick(member);
  }

  renderStatusMenuItem() {
    const { member: { approved } } = this.props;

    const approveItemLabel = approved ? 'Block this user' : 'Approve this user';
    const approveItemIcon = approved ? 'block-user' : 'approve-user';

    return (
      <MenuItem onClick={() => this.handleStatusChange(!approved)}>
        <IconLabel iconName={approveItemIcon}>
          {approveItemLabel}
        </IconLabel>
      </MenuItem>
    )
  }

  renderOwnerDropdownMenu() {
    return (
      <Dropdown.Menu>
        <MenuItem onClick={this.handleEditClick}>
          <IconLabel iconName="edit">
            Edit
          </IconLabel>
        </MenuItem>
      </Dropdown.Menu>
    );
  }

  renderDefaultDropdownMenu() {
    return (
      <Dropdown.Menu>
        <MenuItem onClick={this.handleEditClick}>
          <IconLabel iconName="edit">
            Edit
          </IconLabel>
        </MenuItem>
        {this.renderStatusMenuItem()}
        <MenuItem onClick={this.handleChangePasswordClick}>
          <IconLabel iconName="eyeoff">
            Change password
          </IconLabel>
        </MenuItem>
        <MenuItem onClick={this.handleDeleteClick}>
          <IconLabel iconName="delete">
            Delete
          </IconLabel>
        </MenuItem>
      </Dropdown.Menu>
    )
  }

  render() {
    const { isOwner } = this.props;

    return (
      <Dropdown
        id="member-table-row-actions-menu"
        className="member-table-row-actions-menu"
        pullRight
      >
        <FontIcon bsRole="toggle" name="more" size="24px" />
        {isOwner && this.renderOwnerDropdownMenu()}
        {!isOwner && this.renderDefaultDropdownMenu()}
      </Dropdown>
    )
  }
}

MemberTableRowActionMenu.propTypes = {
  member: PropTypes.object,
  isOwner: PropTypes.bool,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onMemberUpdate: PropTypes.func,
};
