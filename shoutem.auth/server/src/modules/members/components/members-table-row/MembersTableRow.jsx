import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import MemberTableRowActionMenu from '../member-table-row-action-menu';
import './style.scss';

export default class MembersTableRow extends Component {
  constructor(props) {
    super(props);

    this.handleRowClicked = this.handleRowClicked.bind(this);
  }

  handleRowClicked() {
    const { member, onEditClick } = this.props;
    onEditClick(member);
  }

  render() {
    const { member, userId, ...otherProps } = this.props;

    const {
      id,
      nick,
      firstName,
      lastName,
      email,
      approved,
    } = member;

    const isOwner = id === userId;
    const statusClasses = classNames('member-table-row__status', {
      blocked: !approved,
    });

    return (
      <tr className="member-table-row">
        <td className="text-ellipsis" onClick={this.handleRowClicked}>
          {isOwner ? `${nick} (you)` : nick}
        </td>
        <td className="text-ellipsis" onClick={this.handleRowClicked}>
          {`${firstName} ${lastName}`}
        </td>
        <td className="text-ellipsis" onClick={this.handleRowClicked}>
          {email}
        </td>
        <td className={statusClasses} onClick={this.handleRowClicked}>
          {approved ? 'Approved' : 'Blocked'}
        </td>
        <td>
          <MemberTableRowActionMenu
            member={member}
            isOwner={isOwner}
            {...otherProps}
          />
        </td>
      </tr>
    )
  }
}

MembersTableRow.propTypes = {
  member: PropTypes.object,
  userId: PropTypes.string,
  onEditClick: PropTypes.func,
};

MembersTableRow.contextTypes = {
  page: PropTypes.object,
};
