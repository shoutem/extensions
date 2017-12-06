import React, { PropTypes } from 'react';
import _ from 'lodash';
import MembersTableRow from '../members-table-row';
import './style.scss';

function renderEmptyTableRow() {
  return (
    <tr className="members-table__empty-row">
      <td colSpan={5}>No members yet.</td>
    </tr>
  );
}

export default function MembersTable({ members, ...otherProps }) {
  const dataIsEmpty = _.isEmpty(members);

  return (
    <table className="members-table table">
      <thead>
        <tr>
          <th className="members-table__username">Username</th>
          <th className="members-table__name">Full name</th>
          <th className="members-table__email">Email</th>
          <th className="members-table__status">Status</th>
          <th className="members-table__actions" />
        </tr>
      </thead>
      <tbody>
        {dataIsEmpty && renderEmptyTableRow()}
        {!dataIsEmpty && (
          _.map(members, (member) => (
            <MembersTableRow
              key={member.id}
              member={member}
              {...otherProps}
            />
          ))
        )}
      </tbody>
    </table>
  );
}

MembersTable.propTypes = {
  members: PropTypes.array,
};
